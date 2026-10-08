import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Fs } from '@minddrop/file-system';
import {
  MockReadDirInterception,
  interceptMockReadDir,
} from '@minddrop/file-system/test-utils';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { moveEntryMetadataFile } from '../../moveEntryMetadataFile';
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
  getRecordByPath,
  indexAtCurrentContents,
  parentDir,
  referenceEntry1,
  relatedEntry1,
  relatedEntry2,
  resolveRecordPropertyValue,
  resolveRecordedDeletedEntryIds,
  resolveUpsertedEntryPaths,
  seedSqlDatabases,
  seedSqlEntries,
  setup,
  setupRecordingTestSqlDatabase,
  timestampDatabase,
  timestampEntry1,
} from '../../test-utils';
import { BackgroundSyncChangeset, EntryMetadata } from '../../types';
import {
  resolveDatabaseConfigFilePath,
  resolveDatabaseMetadataDirPath,
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

// The path collectionEntry1 is renamed to in the app during a sync
const renamedEntryPath = 'Renamed Entry.md';
// The path of collectionEntry1's sidecar once renamed
const renamedSidecarPath = resolveEntryMetadataFilePath(
  databaseDirPath(collectionDatabase),
  renamedEntryPath,
);

describe('backgroundSyncDatabases', () => {
  beforeEach(() => {
    setup();

    // Open a recording in-memory SQL database
    setupRecordingTestSqlDatabase();

    // Seed each fixture database's SQL record
    seedSqlDatabases();

    // Seed the fixture entries as existing records with a hash no file
    // contents produce. Every entry then appears modified.
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

    const collectionRecord = getRecordByPath(
      sqlGetEntriesFull(),
      collectionEntry1.path,
    );

    // Members should resolve to the path-matched existing IDs,
    // including the cross-database reference.
    expect(resolveRecordPropertyValue(collectionRecord, 'Related')).toEqual([
      relatedEntry1.id,
      relatedEntry2.id,
    ]);
    expect(resolveRecordPropertyValue(collectionRecord, 'References')).toEqual([
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
    const collectionRecord = getRecordByPath(
      sqlGetEntriesFull(),
      collectionEntry1.path,
    );

    expect(collectionRecord.id).toBe(collectionEntry1.id);
    // No entries should have been deleted
    expect(resolveRecordedDeletedEntryIds()).toEqual([]);
  });

  it('drops references to entries deleted offline', async () => {
    // Remove a referenced entry's file as if deleted offline
    MockFs.removeFile(entryFilePath(relatedEntry2));

    await backgroundSyncDatabases(workspace_1.id, parentDir);

    const collectionRecord = getRecordByPath(
      sqlGetEntriesFull(),
      collectionEntry1.path,
    );

    // The deleted member should be dropped from the references
    expect(resolveRecordPropertyValue(collectionRecord, 'Related')).toEqual([
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
    const record = getRecordByPath(sqlGetEntriesFull(), collectionEntry1.path);

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

    // Reset the file's stat dates, as a rewrite replacing the inode does
    MockFs.setFileStats(entryFilePath(collectionEntry1), {
      created: statDate,
      lastModified: statDate,
    });

    await backgroundSyncDatabases(workspace_1.id, parentDir);

    const record = getRecordByPath(sqlGetEntriesFull(), collectionEntry1.path);

    expect(record.created).toBe(sidecarDate.getTime());
    expect(record.lastModified).toBe(sidecarDate.getTime());
  });

  it('sweeps a sidecar orphaned by an entry deleted outside the app', async () => {
    const deletedEntryPath = `${databaseDirPath(collectionDatabase)}/Gone.md`;

    // Add a sidecar left behind by an entry file deleted while the app
    // was closed.
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

    expect(resolveUpsertedEntryPaths(timestampDatabase.id)).toEqual([]);
  });

  it('upserts an entry edited outside the app whose last-modified property did not change', async () => {
    indexAtCurrentContents();

    // Append to the entry's body as an external editor would. Its Last
    // Modified property stays untouched.
    appendToEntryFile(timestampEntry1);

    await backgroundSyncDatabases(workspace_1.id, parentDir);

    // Expect the edit to be detected from the contents. Only the app
    // updates the property.
    expect(resolveUpsertedEntryPaths(timestampDatabase.id)).toContain(
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
    expect(resolveUpsertedEntryPaths(timestampDatabase.id)).toContain(
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
    expect(resolveUpsertedEntryPaths(timestampDatabase.id)).toEqual([]);
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

    const record = getRecordByPath(sqlGetEntriesFull(), collectionEntry1.path);

    expect(JSON.parse(record.metadata).color).toBe('red');
  });

  it('does not re-index an unchanged entry whose sidecar cannot be read', async () => {
    // The metadata the entry's sidecar had before it broke
    const indexedMetadata = JSON.stringify({ color: 'red' });

    // Index the entries at their contents on disk, with the entry's
    // metadata as its sidecar had it.
    indexAtCurrentContents((record) =>
      record.id === collectionEntry1.id
        ? { ...record, metadata: indexedMetadata }
        : record,
    );

    // Break the sidecar outside the app, as a git conflict does
    const sidecarPath = resolveEntryMetadataFilePath(
      databaseDirPath(collectionDatabase),
      collectionEntry1.path,
    );
    const brokenSidecar = '<<<<<<< HEAD\n{"color":"red"}';

    MockFs.addFiles([{ path: sidecarPath, textContent: brokenSidecar }]);

    await backgroundSyncDatabases(workspace_1.id, parentDir);

    // Expect the entry not to be re-read. Re-reading it would overwrite
    // the sidecar with timestamps alone, and its metadata would be lost.
    expect(resolveUpsertedEntryPaths(collectionDatabase.id)).not.toContain(
      collectionEntry1.path,
    );
    expect(MockFs.readTextFile(sidecarPath)).toBe(brokenSidecar);
    expect(
      getRecordByPath(sqlGetEntriesFull(), collectionEntry1.path).metadata,
    ).toBe(indexedMetadata);
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

    const collectionRecord = getRecordByPath(
      sqlGetEntriesFull(),
      collectionEntry1.path,
    );

    expect(resolveRecordPropertyValue(collectionRecord, 'Related')).toEqual([
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
    expect(resolveUpsertedEntryPaths(collectionDatabase.id)).not.toContain(
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

    expect(resolveUpsertedEntryPaths(collectionDatabase.id)).not.toContain(
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

    const collectionRecord = getRecordByPath(
      sqlGetEntriesFull(),
      collectionEntry1.path,
    );

    expect(resolveRecordPropertyValue(collectionRecord, 'Related')).toEqual([
      relatedEntry1.id,
      relatedEntry2.id,
    ]);
  });

  it("moves an entry's sidecar in the app between the sync's entry listing and its sidecar sweep", async () => {
    const { ran, sidecarMoved } = await syncRenamingBeforeSidecarSweep();

    expect(ran).toBe(true);
    expect(sidecarMoved).toBe(true);
  });

  // Pins Issue 53: Background scan sweeps the sidecar of an entry renamed or
  // created in the app during the scan. Remove .fails once fixed.
  it.fails(
    'keeps the sidecar of an entry renamed in the app during the sync',
    async () => {
      await syncRenamingBeforeSidecarSweep();

      // Expect the renamed entry's sidecar to be kept
      expect(MockFs.exists(renamedSidecarPath)).toBe(true);
    },
  );

  it("renames an entry in the app between the sync's index read and its entry listing", async () => {
    const { ran } = await syncRenamingBeforeEntryListing();

    expect(ran).toBe(true);
  });

  // Pins Issue 54: An in-app rename during the startup sync is read as a
  // deletion. The entry is re-keyed. Remove .fails once fixed.
  it.fails(
    'keeps the identity of an entry renamed in the app during the sync',
    async () => {
      const { changeset } = await syncRenamingBeforeEntryListing();

      // Expect the entry kept under its ID. Reading the rename as a
      // deletion strips it from the collections and views referencing it.
      expect(changeset.deletedEntryIds).not.toContain(collectionEntry1.id);
      expect(getRecordByPath(sqlGetEntriesFull(), renamedEntryPath).id).toBe(
        collectionEntry1.id,
      );
    },
  );
});

/**
 * Gives collectionEntry1 a sidecar, then syncs, renaming the entry in the
 * app once the sync has listed the database's entries but before it
 * sweeps the database's sidecars.
 *
 * @returns Whether the rename ran, and whether it moved the sidecar.
 */
async function syncRenamingBeforeSidecarSweep(): Promise<{
  ran: boolean;
  sidecarMoved: boolean;
}> {
  // Whether the rename moved the sidecar
  let sidecarMoved = false;

  // Give the entry a sidecar
  await writeEntryMetadata(
    databaseDirPath(collectionDatabase),
    collectionEntry1.path,
    { color: 'red' },
  );

  // Rename the entry before the sidecar sweep
  const interception = beforeDirectoryRead(
    resolveDatabaseMetadataDirPath(databaseDirPath(collectionDatabase)),
    async () => {
      await renameCollectionEntry1InApp();
      sidecarMoved = MockFs.exists(renamedSidecarPath);
    },
    databaseDirPath(collectionDatabase),
  );

  // Run the sync, then restore the directory listing
  try {
    await backgroundSyncDatabases(workspace_1.id, parentDir);
  } finally {
    interception.restore();
  }

  return { ran: interception.ran, sidecarMoved };
}

/**
 * Syncs, renaming collectionEntry1 in the app once the sync has read the
 * database's records but before it lists the database's entries.
 *
 * @returns Whether the rename ran, and the sync's changeset.
 */
async function syncRenamingBeforeEntryListing(): Promise<{
  ran: boolean;
  changeset: BackgroundSyncChangeset;
}> {
  // Rename the entry before the entry listing
  const interception = beforeDirectoryRead(
    databaseDirPath(collectionDatabase),
    renameCollectionEntry1InApp,
  );

  // Run the sync, then restore the directory listing
  const changeset = await backgroundSyncDatabases(
    workspace_1.id,
    parentDir,
  ).finally(interception.restore);

  return { ran: interception.ran, changeset };
}

/**
 * Runs a callback once, before the file system lists a directory. Stands
 * in for an in-app change landing mid-sync.
 *
 * @param path - The path of the directory.
 * @param callback - The callback to run.
 * @param afterPath - The path of a directory whose listing must come
 *   first. Only a listing following it counts.
 * @returns The interception.
 */
function beforeDirectoryRead(
  path: string,
  callback: () => Promise<void>,
  afterPath?: string,
): MockReadDirInterception {
  // Intercept the directory's listing
  return interceptMockReadDir(MockFs, { path, afterPath, onRead: callback });
}

/**
 * Renames collectionEntry1 the way an in-app rename leaves it. The file
 * and its sidecar are moved. Its record is indexed at the new path under
 * its existing ID.
 */
async function renameCollectionEntry1InApp(): Promise<void> {
  // Resolve the collection database's directory path
  const databasePath = databaseDirPath(collectionDatabase);

  // Move the entry file and its sidecar
  await Fs.rename(
    entryFilePath(collectionEntry1),
    `${databasePath}/${renamedEntryPath}`,
  );
  await moveEntryMetadataFile(
    databasePath,
    collectionEntry1.path,
    renamedEntryPath,
  );

  // Index the record at the new path under its existing ID
  sqlUpsertEntries(
    collectionDatabase.id,
    [
      {
        ...collectionEntry1SqlRecord,
        path: renamedEntryPath,
        title: Fs.removeExtension(renamedEntryPath),
      },
    ],
    { silent: true },
  );
}

/**
 * Indexes collectionEntry1 at its current contents with the given
 * metadata, as a previous sync would have left it.
 *
 * @param metadata - The metadata to index.
 */
function indexCollectionEntry1Metadata(metadata: EntryMetadata): void {
  // Index the entry's record at its current contents
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
