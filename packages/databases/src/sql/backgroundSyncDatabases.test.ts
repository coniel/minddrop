import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { hashContents } from '@minddrop/file-system';
import { readEntryMetadata } from '../readEntryMetadata';
import {
  MockFs,
  cleanup,
  cleanupRecordingTestSqlDatabase,
  clearRecordedSqlStatements,
  collectionDatabase,
  collectionEntry1,
  databaseEntrySqlRecords,
  databases,
  getRecordedSqlStatements,
  parentDir,
  referenceEntry1,
  relatedEntry1,
  relatedEntry2,
  setup,
  setupRecordingTestSqlDatabase,
  timestampDatabase,
  timestampEntry1,
} from '../test-utils';
import { SqlEntryRecord } from '../types';
import { resolveEntryMetadataFilePath } from '../utils';
import { writeEntryMetadata } from '../writeEntryMetadata';
import { backgroundSyncDatabases } from './backgroundSyncDatabases';
import { sqlGetAllEntriesFull } from './sqlGetAllEntriesFull';
import { sqlGetEntrySyncRecords } from './sqlGetEntrySyncRecords';
import { sqlUpsertDatabase } from './sqlUpsertDatabase';
import { sqlUpsertEntries } from './sqlUpsertEntries';

// A file's stat dates, as reset by a rewrite of the entry file
const statDate = new Date('2026-02-02T00:00:00.000Z');
// The entry's real creation date, as held by its sidecar
const sidecarDate = new Date('2020-03-03T00:00:00.000Z');

describe('backgroundSyncDatabases', () => {
  beforeEach(() => {
    setup();

    // Open a recording in-memory SQL database
    setupRecordingTestSqlDatabase();

    // Seed each fixture database's SQL record
    databases.forEach((database) => {
      sqlUpsertDatabase(
        {
          id: database.id,
          name: database.name,
          path: database.path,
          icon: database.icon,
        },
        { silent: true },
      );
    });

    // Seed the fixture entries as existing records with a hash no
    // file contents produce, so every entry appears modified
    seedSqlEntries((record) => ({
      ...record,
      lastModified: 0,
      contentHash: '',
    }));

    // Drop the seeding statements so tests only see the sync's SQL
    clearRecordedSqlStatements();
  });

  afterEach(async () => {
    cleanupRecordingTestSqlDatabase();
    await cleanup();
  });

  it('resolves references to the existing entry IDs', async () => {
    await backgroundSyncDatabases(parentDir);

    const collectionRecord = recordByPath(
      sqlGetAllEntriesFull(),
      collectionEntry1.path,
    );

    // Members should resolve to the path-matched existing IDs,
    // including the cross-database reference
    expect(propertyValue(collectionRecord, 'Related')).toEqual([
      relatedEntry1.id,
      relatedEntry2.id,
    ]);
    expect(propertyValue(collectionRecord, 'References')).toEqual([
      referenceEntry1.id,
    ]);
  });

  it('keeps entry identities across offline database renames', async () => {
    // The SQL rows carry the database's pre-rename path
    const oldDatabasePath = `${parentDir}/Old Collection`;

    sqlUpsertDatabase(
      {
        id: collectionDatabase.id,
        name: collectionDatabase.name,
        path: oldDatabasePath,
        icon: collectionDatabase.icon,
      },
      { silent: true },
    );

    // Entry records carry the pre-rename entry paths
    sqlUpsertEntries(
      collectionDatabase.id,
      databaseEntrySqlRecords
        .filter((record) => record.databaseId === collectionDatabase.id)
        .map((record) => ({
          ...record,
          path: record.path.replace(collectionDatabase.path, oldDatabasePath),
          lastModified: 0,
          contentHash: '',
        })),
      { silent: true },
    );

    // Drop the reseeding statements from the log
    clearRecordedSqlStatements();

    await backgroundSyncDatabases(parentDir);

    // Entries at the renamed paths should keep their existing IDs
    const collectionRecord = recordByPath(
      sqlGetAllEntriesFull(),
      collectionEntry1.path,
    );

    expect(collectionRecord.id).toBe(collectionEntry1.id);
    // No entries should have been deleted
    expect(deletedEntryIds()).toEqual([]);
  });

  it('drops references to entries deleted offline', async () => {
    // Remove a referenced entry's file as if deleted offline
    MockFs.removeFile(relatedEntry2.path);

    await backgroundSyncDatabases(parentDir);

    const collectionRecord = recordByPath(
      sqlGetAllEntriesFull(),
      collectionEntry1.path,
    );

    // The deleted member should be dropped from the references
    expect(propertyValue(collectionRecord, 'Related')).toEqual([
      relatedEntry1.id,
    ]);
    // The deleted entry should be removed from SQL
    expect(
      sqlGetEntrySyncRecords(collectionDatabase.id).map((record) => record.id),
    ).not.toContain(relatedEntry2.id);
  });

  it("includes a changed entry's sidecar metadata in its upserted record", async () => {
    const metadata = {
      embeddedViewConfigs: { 'card:Related': { options: {}, data: {} } },
    };

    await writeEntryMetadata(
      collectionDatabase.path,
      collectionEntry1.path,
      metadata,
    );

    await backgroundSyncDatabases(parentDir);

    // Metadata is read for changed entries only, after the diff
    const record = recordByPath(sqlGetAllEntriesFull(), collectionEntry1.path);

    expect(JSON.parse(record.metadata)).toMatchObject(metadata);
  });

  it("seeds a changed entry's sidecar with its stat derived timestamps", async () => {
    MockFs.setFileStats(collectionEntry1.path, {
      created: statDate,
      lastModified: statDate,
    });

    await backgroundSyncDatabases(parentDir);

    const metadata = await readEntryMetadata(
      collectionDatabase.path,
      collectionEntry1.path,
    );

    expect(metadata.created).toEqual(statDate);
    expect(metadata.lastModified).toEqual(statDate);
  });

  it('keeps a seeded entry timestamps when its file is rewritten', async () => {
    await writeEntryMetadata(collectionDatabase.path, collectionEntry1.path, {
      created: sidecarDate,
      lastModified: sidecarDate,
    });

    // The rewrite replaced the inode, resetting the file's stat dates
    MockFs.setFileStats(collectionEntry1.path, {
      created: statDate,
      lastModified: statDate,
    });

    await backgroundSyncDatabases(parentDir);

    const record = recordByPath(sqlGetAllEntriesFull(), collectionEntry1.path);

    expect(record.created).toBe(sidecarDate.getTime());
    expect(record.lastModified).toBe(sidecarDate.getTime());
  });

  it('sweeps a sidecar orphaned by an entry deleted outside the app', async () => {
    const deletedEntryPath = `${collectionDatabase.path}/Gone.md`;

    // A sidecar left behind by an entry file deleted while the app
    // was closed, so nothing was around to remove it
    await writeEntryMetadata(collectionDatabase.path, deletedEntryPath, {
      embeddedViewConfigs: { 'card:Related': { options: {}, data: {} } },
    });

    await backgroundSyncDatabases(parentDir);

    expect(
      MockFs.exists(
        resolveEntryMetadataFilePath(collectionDatabase.path, deletedEntryPath),
      ),
    ).toBe(false);
  });

  it('keeps the sidecar of an entry which still exists', async () => {
    await writeEntryMetadata(collectionDatabase.path, collectionEntry1.path, {
      embeddedViewConfigs: { 'card:Related': { options: {}, data: {} } },
    });

    await backgroundSyncDatabases(parentDir);

    expect(
      MockFs.exists(
        resolveEntryMetadataFilePath(
          collectionDatabase.path,
          collectionEntry1.path,
        ),
      ),
    ).toBe(true);
  });

  it('does not upsert entries whose contents are unchanged', async () => {
    indexAtCurrentContents();

    await backgroundSyncDatabases(parentDir);

    expect(upsertedEntryPaths(timestampDatabase.id)).toEqual([]);
  });

  it('upserts an entry edited outside the app whose last-modified property did not change', async () => {
    indexAtCurrentContents();

    // Append to the entry's body as an external editor would,
    // leaving its Last Modified property untouched
    MockFs.writeTextFile(
      timestampEntry1.path,
      `${MockFs.readTextFile(timestampEntry1.path)}\n\nAdded externally`,
    );

    await backgroundSyncDatabases(parentDir);

    // The edit should be detected from the contents rather than the
    // property, which only the app updates
    expect(upsertedEntryPaths(timestampDatabase.id)).toContain(
      timestampEntry1.path,
    );
  });
});

/**
 * Reseeds every fixture entry's SQL record via the given transform,
 * grouped by database.
 */
function seedSqlEntries(
  transform: (record: SqlEntryRecord) => SqlEntryRecord,
): void {
  databases.forEach((database) => {
    // Collect the database's transformed entry records
    const records = databaseEntrySqlRecords
      .filter((record) => record.databaseId === database.id)
      .map(transform);

    // Skip databases without entries
    if (records.length > 0) {
      sqlUpsertEntries(database.id, records, { silent: true });
    }
  });
}

/**
 * Indexes every fixture entry at the contents currently on disk, so
 * that nothing appears changed until a file is edited.
 */
function indexAtCurrentContents(): void {
  // Reseed the records with the current on-disk content hashes
  seedSqlEntries((record) => ({
    ...record,
    contentHash: hashContents(MockFs.readTextFile(record.path)),
  }));

  // Drop the reseeding statements from the log
  clearRecordedSqlStatements();
}

/**
 * Returns the paths of the entries upserted into the given database,
 * read from the recorded SQL statements.
 */
function upsertedEntryPaths(databaseId: string): string[] {
  return getRecordedSqlStatements()
    .filter(
      (statement) =>
        statement.sql.includes('INSERT OR REPLACE INTO entries') &&
        statement.params[1] === databaseId,
    )
    .map((statement) => statement.params[2] as string);
}

/**
 * Returns the IDs of the entries deleted from SQL, read from the
 * recorded SQL statements.
 */
function deletedEntryIds(): string[] {
  return getRecordedSqlStatements()
    .filter((statement) => statement.sql === 'DELETE FROM entries WHERE id = ?')
    .map((statement) => statement.params[0] as string);
}

/**
 * Returns the record with the given path.
 */
function recordByPath(records: SqlEntryRecord[], path: string): SqlEntryRecord {
  return records.find((record) => record.path === path)!;
}

/**
 * Returns the value of the named property on a record.
 */
function propertyValue(record: SqlEntryRecord, name: string) {
  return record.properties.find((property) => property.name === name)?.value;
}
