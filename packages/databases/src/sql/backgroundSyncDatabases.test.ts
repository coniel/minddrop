import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { hashContents } from '@minddrop/file-system';
import { readEntryMetadata } from '../readEntryMetadata';
import {
  MockFs,
  cleanup,
  collectionDatabase,
  collectionEntry1,
  databaseEntrySqlRecords,
  databases,
  parentDir,
  referenceEntry1,
  relatedEntry1,
  relatedEntry2,
  setup,
  timestampDatabase,
  timestampEntry1,
} from '../test-utils';
import { SqlEntryRecord } from '../types';
import { resolveEntryMetadataFilePath } from '../utils';
import { writeEntryMetadata } from '../writeEntryMetadata';
import { backgroundSyncDatabases } from './backgroundSyncDatabases';
import { sqlDeleteEntries } from './sqlDeleteEntries';
import { sqlGetAllDatabases } from './sqlGetAllDatabases';
import { sqlGetEntrySyncRecords } from './sqlGetEntrySyncRecords';
import { sqlUpsertEntries } from './sqlUpsertEntries';

// A file's stat dates, as reset by a rewrite of the entry file
const statDate = new Date('2026-02-02T00:00:00.000Z');
// The entry's real creation date, as held by its sidecar
const sidecarDate = new Date('2020-03-03T00:00:00.000Z');

// Mock SQL operations since no database connection is available in tests
vi.mock('@minddrop/sql', () => ({
  Sql: { all: vi.fn(() => []) },
}));
vi.mock('./sqlGetAllDatabases', () => ({ sqlGetAllDatabases: vi.fn() }));
vi.mock('./sqlGetEntrySyncRecords', () => ({
  sqlGetEntrySyncRecords: vi.fn(),
}));
vi.mock('./sqlGetAllEntriesFull', () => ({
  sqlGetAllEntriesFull: vi.fn(() => []),
}));
vi.mock('./sqlDeleteDatabase', () => ({ sqlDeleteDatabase: vi.fn() }));
vi.mock('./sqlDeleteEntries', () => ({ sqlDeleteEntries: vi.fn() }));
vi.mock('./sqlUpsertDatabase', () => ({ sqlUpsertDatabase: vi.fn() }));
vi.mock('./sqlUpsertEntries', () => ({ sqlUpsertEntries: vi.fn() }));
vi.mock('./sqlUpdateEntryMetadata', () => ({
  sqlUpdateEntryMetadata: vi.fn(),
}));

describe('backgroundSyncDatabases', () => {
  beforeEach(() => {
    setup();

    // Return the fixture databases from SQL
    vi.mocked(sqlGetAllDatabases).mockReturnValue(
      databases.map((database) => ({
        id: database.id,
        name: database.name,
        path: database.path,
        icon: database.icon,
      })),
    );

    // Return the fixture entries as existing sync records with a
    // hash no file contents produce, so every entry appears modified
    vi.mocked(sqlGetEntrySyncRecords).mockImplementation((databaseId) =>
      databaseEntrySqlRecords
        .filter((record) => record.databaseId === databaseId)
        .map((record) => ({
          id: record.id,
          path: record.path,
          lastModified: 0,
          contentHash: '',
        })),
    );
  });

  afterEach(cleanup);

  it('resolves references to the existing entry IDs', async () => {
    await backgroundSyncDatabases(parentDir);

    const collectionRecord = recordByPath(
      upsertedRecords(collectionDatabase.id),
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

    vi.mocked(sqlGetAllDatabases).mockReturnValue(
      databases.map((database) => ({
        id: database.id,
        name: database.name,
        path:
          database.id === collectionDatabase.id
            ? oldDatabasePath
            : database.path,
        icon: database.icon,
      })),
    );

    // Entry sync records carry the pre-rename entry paths
    vi.mocked(sqlGetEntrySyncRecords).mockImplementation((databaseId) =>
      databaseEntrySqlRecords
        .filter((record) => record.databaseId === databaseId)
        .map((record) => ({
          id: record.id,
          path:
            record.databaseId === collectionDatabase.id
              ? record.path.replace(collectionDatabase.path, oldDatabasePath)
              : record.path,
          lastModified: 0,
          contentHash: '',
        })),
    );

    await backgroundSyncDatabases(parentDir);

    // Entries at the renamed paths should keep their existing IDs
    const collectionRecord = recordByPath(
      upsertedRecords(collectionDatabase.id),
      collectionEntry1.path,
    );

    expect(collectionRecord.id).toBe(collectionEntry1.id);
    // No entries should be treated as deleted
    expect(sqlDeleteEntries).not.toHaveBeenCalled();
  });

  it('drops references to entries deleted offline', async () => {
    // Remove a referenced entry's file as if deleted offline
    MockFs.removeFile(relatedEntry2.path);

    await backgroundSyncDatabases(parentDir);

    const collectionRecord = recordByPath(
      upsertedRecords(collectionDatabase.id),
      collectionEntry1.path,
    );

    // The deleted member should be dropped from the references
    expect(propertyValue(collectionRecord, 'Related')).toEqual([
      relatedEntry1.id,
    ]);
    // The deleted entry should be removed from SQL
    expect(sqlDeleteEntries).toHaveBeenCalledWith(
      collectionDatabase.id,
      [relatedEntry2.id],
      { silent: true },
    );
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
    const record = recordByPath(
      upsertedRecords(collectionDatabase.id),
      collectionEntry1.path,
    );

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

    const record = recordByPath(
      upsertedRecords(collectionDatabase.id),
      collectionEntry1.path,
    );

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

    expect(upsertedRecords(timestampDatabase.id)).toEqual([]);
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
    expect(
      recordByPath(upsertedRecords(timestampDatabase.id), timestampEntry1.path),
    ).toBeDefined();
  });
});

/**
 * Indexes every fixture entry at the contents currently on disk, so
 * that nothing appears changed until a file is edited.
 */
function indexAtCurrentContents(): void {
  // Hashed up front rather than inside the mock, which would rehash
  // the edited contents at call time and see no change
  const hashes = new Map(
    databaseEntrySqlRecords.map((record) => [
      record.id,
      hashContents(MockFs.readTextFile(record.path)),
    ]),
  );

  vi.mocked(sqlGetEntrySyncRecords).mockImplementation((databaseId) =>
    databaseEntrySqlRecords
      .filter((record) => record.databaseId === databaseId)
      .map((record) => ({
        id: record.id,
        path: record.path,
        lastModified: record.lastModified,
        contentHash: hashes.get(record.id) ?? '',
      })),
  );
}

/**
 * Returns all records upserted for the given database.
 */
function upsertedRecords(databaseId: string): SqlEntryRecord[] {
  return vi
    .mocked(sqlUpsertEntries)
    .mock.calls.filter(([id]) => id === databaseId)
    .flatMap(([, records]) => records);
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
