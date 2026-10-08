import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Fs } from '@minddrop/file-system';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { readEntryMetadata } from '../../readEntryMetadata';
import {
  MockFs,
  appendToEntryFile,
  breakEntryFile,
  cleanup,
  cleanupRecordingTestSqlDatabase,
  clearRecordedSqlStatements,
  collectionDatabase,
  collectionEntry1,
  collectionEntry1SqlRecord,
  databaseDirPath,
  entryFilePath,
  entrySqlRecords,
  indexAtCurrentContents,
  parentDir,
  propertyValue,
  recordByPath,
  recordedDeletedEntryIds,
  referenceEntry1,
  relatedEntry1,
  relatedEntry2,
  seedSqlDatabases,
  seedSqlEntries,
  setup,
  setupRecordingTestSqlDatabase,
  timestampDatabase,
  timestampEntry1,
  upsertedEntryPaths,
} from '../../test-utils';
import { EntryMetadata } from '../../types';
import {
  resolveDatabaseConfigFilePath,
  resolveEntryMetadataFilePath,
} from '../../utils';
import { writeEntryMetadata } from '../../writeEntryMetadata';
import { sqlGetEntriesFull } from '../sqlGetEntriesFull';
import { sqlGetEntrySyncRecords } from '../sqlGetEntrySyncRecords';
import { sqlUpsertDatabase } from '../sqlUpsertDatabase';
import { sqlUpsertEntries } from '../sqlUpsertEntries';
import { backgroundSyncDatabases } from './backgroundSyncDatabases';

const { workspace_1 } = WorkspaceFixtures;

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
    seedSqlDatabases();

    // Seed the fixture entries as existing records with a hash no
    // file contents produce, so every entry appears modified.
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
    await backgroundSyncDatabases(workspace_1.id, parentDir);

    const collectionRecord = recordByPath(
      sqlGetEntriesFull(),
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
        properties: collectionDatabase.properties,
      },
      { silent: true },
    );

    // Entry records carry the pre-rename entry paths
    sqlUpsertEntries(
      collectionDatabase.id,
      entrySqlRecords
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

    await backgroundSyncDatabases(workspace_1.id, parentDir);

    // Entries at the renamed paths should keep their existing IDs
    const collectionRecord = recordByPath(
      sqlGetEntriesFull(),
      collectionEntry1.path,
    );

    expect(collectionRecord.id).toBe(collectionEntry1.id);
    // No entries should have been deleted
    expect(recordedDeletedEntryIds()).toEqual([]);
  });

  it('drops references to entries deleted offline', async () => {
    // Remove a referenced entry's file as if deleted offline
    MockFs.removeFile(entryFilePath(relatedEntry2));

    await backgroundSyncDatabases(workspace_1.id, parentDir);

    const collectionRecord = recordByPath(
      sqlGetEntriesFull(),
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
    const metadata: EntryMetadata = {
      color: 'red',
    };

    await writeEntryMetadata(
      databaseDirPath(collectionDatabase),
      entryFilePath(collectionEntry1),
      metadata,
    );

    await backgroundSyncDatabases(workspace_1.id, parentDir);

    // Metadata is read for changed entries only, after the diff
    const record = recordByPath(sqlGetEntriesFull(), collectionEntry1.path);

    expect(JSON.parse(record.metadata)).toMatchObject(metadata);
  });

  it("seeds a changed entry's sidecar with its stat derived timestamps", async () => {
    MockFs.setFileStats(entryFilePath(collectionEntry1), {
      created: statDate,
      lastModified: statDate,
    });

    await backgroundSyncDatabases(workspace_1.id, parentDir);

    const metadata = await readEntryMetadata(
      databaseDirPath(collectionDatabase),
      entryFilePath(collectionEntry1),
    );

    expect(metadata.created).toEqual(statDate);
    expect(metadata.lastModified).toEqual(statDate);
  });

  it('keeps a seeded entry timestamps when its file is rewritten', async () => {
    await writeEntryMetadata(
      databaseDirPath(collectionDatabase),
      entryFilePath(collectionEntry1),
      {
        created: sidecarDate,
        lastModified: sidecarDate,
      },
    );

    // The rewrite replaced the inode, resetting the file's stat dates
    MockFs.setFileStats(entryFilePath(collectionEntry1), {
      created: statDate,
      lastModified: statDate,
    });

    await backgroundSyncDatabases(workspace_1.id, parentDir);

    const record = recordByPath(sqlGetEntriesFull(), collectionEntry1.path);

    expect(record.created).toBe(sidecarDate.getTime());
    expect(record.lastModified).toBe(sidecarDate.getTime());
  });

  it('sweeps a sidecar orphaned by an entry deleted outside the app', async () => {
    const deletedEntryPath = `${databaseDirPath(collectionDatabase)}/Gone.md`;

    // A sidecar left behind by an entry file deleted while the app
    // was closed, so nothing was around to remove it.
    await writeEntryMetadata(
      databaseDirPath(collectionDatabase),
      deletedEntryPath,
      {
        color: 'red',
      },
    );

    await backgroundSyncDatabases(workspace_1.id, parentDir);

    expect(
      MockFs.exists(
        resolveEntryMetadataFilePath(
          databaseDirPath(collectionDatabase),
          deletedEntryPath,
        ),
      ),
    ).toBe(false);
  });

  it('keeps the sidecar of an entry which still exists', async () => {
    await writeEntryMetadata(
      databaseDirPath(collectionDatabase),
      entryFilePath(collectionEntry1),
      {
        color: 'red',
      },
    );

    await backgroundSyncDatabases(workspace_1.id, parentDir);

    expect(
      MockFs.exists(
        resolveEntryMetadataFilePath(
          databaseDirPath(collectionDatabase),
          entryFilePath(collectionEntry1),
        ),
      ),
    ).toBe(true);
  });

  it('does not upsert entries whose contents are unchanged', async () => {
    indexAtCurrentContents();

    await backgroundSyncDatabases(workspace_1.id, parentDir);

    expect(upsertedEntryPaths(timestampDatabase.id)).toEqual([]);
  });

  it('upserts an entry edited outside the app whose last-modified property did not change', async () => {
    indexAtCurrentContents();

    // Append to the entry's body as an external editor would,
    // leaving its Last Modified property untouched
    appendToEntryFile(timestampEntry1);

    await backgroundSyncDatabases(workspace_1.id, parentDir);

    // The edit should be detected from the contents rather than the
    // property, which only the app updates.
    expect(upsertedEntryPaths(timestampDatabase.id)).toContain(
      timestampEntry1.path,
    );
  });

  it('re-indexes every entry of a database whose properties changed', async () => {
    indexAtCurrentContents();

    // Add a property to the database's config outside of the app
    const configPath = resolveDatabaseConfigFilePath(
      databaseDirPath(timestampDatabase),
    );
    const config = JSON.parse(MockFs.readTextFile(configPath));

    MockFs.writeTextFile(
      configPath,
      JSON.stringify({
        ...config,
        properties: [...config.properties, { name: 'Added', type: 'text' }],
      }),
    );

    const changeset = await backgroundSyncDatabases(workspace_1.id, parentDir);

    // The unchanged entry should be re-indexed against the new schema
    expect(upsertedEntryPaths(timestampDatabase.id)).toContain(
      timestampEntry1.path,
    );
    expect(changeset.upsertedDatabases.map((database) => database.id)).toEqual([
      timestampDatabase.id,
    ]);

    // Drop the first sync's statements from the log
    clearRecordedSqlStatements();

    const nextChangeset = await backgroundSyncDatabases(
      workspace_1.id,
      parentDir,
    );

    // The next sync should find the new schema already indexed
    expect(upsertedEntryPaths(timestampDatabase.id)).toEqual([]);
    expect(nextChangeset.upsertedDatabases).toEqual([]);
  });

  it('re-indexes an entry whose sidecar changed while its file did not', async () => {
    indexAtCurrentContents();

    // Change only the entry's sidecar, as another device syncing a
    // colour change would.
    await writeEntryMetadata(
      databaseDirPath(collectionDatabase),
      collectionEntry1.path,
      { color: 'red' },
    );

    await backgroundSyncDatabases(workspace_1.id, parentDir);

    const record = recordByPath(sqlGetEntriesFull(), collectionEntry1.path);

    expect(JSON.parse(record.metadata).color).toBe('red');
  });

  it('does not re-index an unchanged entry whose sidecar cannot be read', async () => {
    // Index the entry at its contents on disk, with the metadata its
    // sidecar held before it broke.
    seedSqlEntries((record) => ({
      ...record,
      contentHash: Fs.hashContents(
        MockFs.readTextFile(
          entryFilePath({ database: record.databaseId, path: record.path }),
        ),
      ),
      metadata:
        record.id === collectionEntry1.id
          ? JSON.stringify({ color: 'red' })
          : record.metadata,
    }));
    clearRecordedSqlStatements();

    // A sidecar broken outside the app, as by a git conflict
    const sidecarPath = resolveEntryMetadataFilePath(
      databaseDirPath(collectionDatabase),
      collectionEntry1.path,
    );
    const brokenSidecar = '<<<<<<< HEAD\n{"color":"red"}';

    MockFs.addFiles([{ path: sidecarPath, textContent: brokenSidecar }]);

    await backgroundSyncDatabases(workspace_1.id, parentDir);

    // Re-reading the entry would overwrite the sidecar with timestamps
    // alone, losing the metadata it holds.
    expect(upsertedEntryPaths(collectionDatabase.id)).not.toContain(
      collectionEntry1.path,
    );
    expect(MockFs.readTextFile(sidecarPath)).toBe(brokenSidecar);
  });

  it('keeps entries whose contents are unchanged', async () => {
    indexAtCurrentContents();

    const changeset = await backgroundSyncDatabases(workspace_1.id, parentDir);

    expect(changeset.deletedEntryIds).toEqual([]);
    expect(
      sqlGetEntrySyncRecords(collectionDatabase.id).map((record) => record.id),
    ).toContain(collectionEntry1.id);
  });

  it('resolves references to entries whose contents are unchanged', async () => {
    indexAtCurrentContents();

    // Change only the referencing entry
    appendToEntryFile(collectionEntry1);

    await backgroundSyncDatabases(workspace_1.id, parentDir);

    const collectionRecord = recordByPath(
      sqlGetEntriesFull(),
      collectionEntry1.path,
    );

    expect(propertyValue(collectionRecord, 'Related')).toEqual([
      relatedEntry1.id,
      relatedEntry2.id,
    ]);
  });

  it('keeps the sidecar of an entry whose contents are unchanged', async () => {
    const metadata: EntryMetadata = { color: 'red' };

    await writeEntryMetadata(
      databaseDirPath(collectionDatabase),
      collectionEntry1.path,
      metadata,
    );
    indexAtCurrentContents();
    indexCollectionEntry1Metadata(metadata);

    await backgroundSyncDatabases(workspace_1.id, parentDir);

    // The entry should be retained rather than re-read
    expect(upsertedEntryPaths(collectionDatabase.id)).not.toContain(
      collectionEntry1.path,
    );
    expect(
      MockFs.exists(
        resolveEntryMetadataFilePath(
          databaseDirPath(collectionDatabase),
          collectionEntry1.path,
        ),
      ),
    ).toBe(true);
  });

  it('does not re-index an entry whose sidecar dates match its indexed metadata', async () => {
    const metadata: EntryMetadata = {
      created: sidecarDate,
      lastModified: sidecarDate,
    };

    await writeEntryMetadata(
      databaseDirPath(collectionDatabase),
      collectionEntry1.path,
      metadata,
    );
    indexAtCurrentContents();
    indexCollectionEntry1Metadata(metadata);

    await backgroundSyncDatabases(workspace_1.id, parentDir);

    expect(upsertedEntryPaths(collectionDatabase.id)).not.toContain(
      collectionEntry1.path,
    );
  });

  it('keeps an entry whose file cannot be parsed', async () => {
    breakEntryFile(collectionEntry1);

    const changeset = await backgroundSyncDatabases(workspace_1.id, parentDir);

    expect(changeset.deletedEntryIds).not.toContain(collectionEntry1.id);
    expect(
      sqlGetEntrySyncRecords(collectionDatabase.id).map((record) => record.id),
    ).toContain(collectionEntry1.id);
  });

  it('keeps the sidecar of an entry whose file cannot be parsed', async () => {
    await writeEntryMetadata(
      databaseDirPath(collectionDatabase),
      entryFilePath(collectionEntry1),
      {
        color: 'red',
      },
    );
    breakEntryFile(collectionEntry1);

    await backgroundSyncDatabases(workspace_1.id, parentDir);

    expect(
      MockFs.exists(
        resolveEntryMetadataFilePath(
          databaseDirPath(collectionDatabase),
          entryFilePath(collectionEntry1),
        ),
      ),
    ).toBe(true);
  });

  it('resolves references to an entry whose file cannot be parsed', async () => {
    breakEntryFile(relatedEntry1);

    await backgroundSyncDatabases(workspace_1.id, parentDir);

    const collectionRecord = recordByPath(
      sqlGetEntriesFull(),
      collectionEntry1.path,
    );

    expect(propertyValue(collectionRecord, 'Related')).toEqual([
      relatedEntry1.id,
      relatedEntry2.id,
    ]);
  });
});

/**
 * Indexes collectionEntry1 at its current contents with the given
 * metadata, as a previous sync would have left it.
 */
function indexCollectionEntry1Metadata(metadata: EntryMetadata): void {
  sqlUpsertEntries(
    collectionDatabase.id,
    [
      {
        ...collectionEntry1SqlRecord,
        contentHash: Fs.hashContents(
          MockFs.readTextFile(entryFilePath(collectionEntry1)),
        ),
        metadata: JSON.stringify(metadata),
      },
    ],
    { silent: true },
  );

  // Drop the indexing statements from the log
  clearRecordedSqlStatements();
}
