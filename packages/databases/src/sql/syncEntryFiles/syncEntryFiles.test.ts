import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Fs } from '@minddrop/file-system';
import { registerCountingMockFileSystem } from '@minddrop/file-system/test-utils';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { readEntryMetadata } from '../../readEntryMetadata';
import {
  MockFs,
  appendToEntryFile,
  breakEntryFile,
  cleanup,
  cleanupRecordingTestSqlDatabase,
  collectionDatabase,
  collectionEntry1,
  connectTestSqlWorkspace,
  createEntryFileChange,
  databaseDirPath,
  databases,
  entryFilePath,
  getRecordByPath,
  indexAtCurrentContents,
  parentDir,
  relatedEntry1,
  relatedEntry2,
  resolveRecordPropertyValue,
  resolveUpsertedEntryPaths,
  seedSqlDatabases,
  setup,
  setupRecordingTestSqlDatabase,
  timestampEntry1,
} from '../../test-utils';
import { EntryFileChange } from '../../types';
import { resolveEntryMetadataFilePath } from '../../utils';
import { writeEntryMetadata } from '../../writeEntryMetadata';
import { sqlGetEntriesFull } from '../sqlGetEntriesFull';
import { sqlGetEntrySyncRecords } from '../sqlGetEntrySyncRecords';
import { syncEntryFiles } from './syncEntryFiles';

const { workspace_1, workspace_2 } = WorkspaceFixtures;

// A new entry file's stat dates
const statDate = new Date('2026-02-02T00:00:00.000Z');
// The timestamps in an entry's sidecar
const sidecarDate = new Date('2020-03-03T00:00:00.000Z');

describe('syncEntryFiles', () => {
  beforeEach(() => {
    setup();

    // Open a recording in-memory SQL database
    setupRecordingTestSqlDatabase();

    // Seed each fixture database's SQL record
    seedSqlDatabases();

    // Index the fixture entries at the contents on disk. Nothing then
    // appears changed until a file is edited.
    indexAtCurrentContents();
  });

  afterEach(async () => {
    cleanupRecordingTestSqlDatabase();
    await cleanup();
  });

  it('re-indexes an entry whose file changed under its existing ID', async () => {
    appendToEntryFile(timestampEntry1);

    const changeset = await sync([
      createEntryFileChange(timestampEntry1.database, timestampEntry1.path),
    ]);

    expect(changeset.upsertedEntries.map((record) => record.id)).toEqual([
      timestampEntry1.id,
    ]);

    // The record should be indexed at the new contents
    const record = getRecordByPath(sqlGetEntriesFull(), timestampEntry1.path);

    expect(record.contentHash).toBe(
      Fs.hashContents(MockFs.readTextFile(entryFilePath(timestampEntry1))),
    );
  });

  it('only re-indexes the changed entries', async () => {
    appendToEntryFile(collectionEntry1);

    await sync([
      createEntryFileChange(collectionEntry1.database, collectionEntry1.path),
    ]);

    // No other entry of any database, the changed entry's own
    // included, should be upserted.
    databases.forEach((database) => {
      expect(resolveUpsertedEntryPaths(database.id)).toEqual(
        database.id === collectionDatabase.id ? [collectionEntry1.path] : [],
      );
    });
  });

  it('does not re-index an entry whose contents match the index', async () => {
    const changeset = await sync([
      createEntryFileChange(timestampEntry1.database, timestampEntry1.path),
    ]);

    expect(changeset.hasChanges).toBe(false);
    expect(resolveUpsertedEntryPaths(timestampEntry1.database)).toEqual([]);
  });

  it('indexes a new entry', async () => {
    MockFs.addFiles([
      {
        path: `${databaseDirPath(collectionDatabase)}/New Entry.md`,
        textContent: '---\nRelated: []\n---\n',
      },
    ]);

    const changeset = await sync([
      createEntryFileChange(collectionDatabase.id, 'New Entry.md'),
    ]);

    expect(changeset.upsertedEntries.map((record) => record.path)).toEqual([
      'New Entry.md',
    ]);
  });

  it("seeds a new entry's sidecar with its stat derived timestamps", async () => {
    const path = `${databaseDirPath(collectionDatabase)}/New Entry.md`;

    MockFs.addFiles([{ path, textContent: '---\nRelated: []\n---\n' }]);
    MockFs.setFileStats(path, { created: statDate, lastModified: statDate });

    await sync([createEntryFileChange(collectionDatabase.id, 'New Entry.md')]);

    const metadata = await readEntryMetadata(
      databaseDirPath(collectionDatabase),
      'New Entry.md',
    );

    expect(metadata.created).toEqual(statDate);
    expect(metadata.lastModified).toEqual(statDate);
  });

  it("resolves new entries' references to each other", async () => {
    MockFs.addFiles([
      {
        path: `${databaseDirPath(collectionDatabase)}/New A.md`,
        textContent: `---\nRelated:\n  - ${collectionDatabase.name}/New B\n---\n`,
      },
      {
        path: `${databaseDirPath(collectionDatabase)}/New B.md`,
        textContent: `---\nRelated:\n  - ${collectionDatabase.name}/New A\n---\n`,
      },
    ]);

    await sync([
      createEntryFileChange(collectionDatabase.id, 'New A.md'),
      createEntryFileChange(collectionDatabase.id, 'New B.md'),
    ]);

    const records = sqlGetEntriesFull();
    const recordA = getRecordByPath(records, 'New A.md');
    const recordB = getRecordByPath(records, 'New B.md');

    expect(resolveRecordPropertyValue(recordA, 'Related')).toEqual([
      recordB.id,
    ]);
    expect(resolveRecordPropertyValue(recordB, 'Related')).toEqual([
      recordA.id,
    ]);
  });

  it('deletes an entry whose file is gone', async () => {
    MockFs.removeFile(entryFilePath(collectionEntry1));

    const changeset = await sync([
      createEntryFileChange(collectionEntry1.database, collectionEntry1.path),
    ]);

    expect(changeset.deletedEntryIds).toEqual([collectionEntry1.id]);
    expect(
      sqlGetEntrySyncRecords(collectionDatabase.id).map((record) => record.id),
    ).not.toContain(collectionEntry1.id);
  });

  it('removes the sidecar of an entry whose file is gone', async () => {
    await writeEntryMetadata(
      databaseDirPath(collectionDatabase),
      collectionEntry1.path,
      { color: 'red' },
    );
    MockFs.removeFile(entryFilePath(collectionEntry1));

    await sync([
      createEntryFileChange(collectionEntry1.database, collectionEntry1.path),
    ]);

    expect(
      MockFs.exists(
        resolveEntryMetadataFilePath(
          databaseDirPath(collectionDatabase),
          collectionEntry1.path,
        ),
      ),
    ).toBe(false);
  });

  it('ignores the deletion of an entry which is not indexed', async () => {
    // As when the app deleted the entry and its record itself
    const changeset = await sync([
      createEntryFileChange(collectionDatabase.id, 'Gone.md'),
    ]);

    expect(changeset.hasChanges).toBe(false);
  });

  it('re-indexes an entry whose sidecar changed while its file did not', async () => {
    await writeEntryMetadata(
      databaseDirPath(collectionDatabase),
      collectionEntry1.path,
      { color: 'red' },
    );

    const changeset = await sync([
      createEntryFileChange(
        collectionEntry1.database,
        collectionEntry1.path,
        'metadata',
      ),
    ]);

    const record = getRecordByPath(
      changeset.upsertedEntries,
      collectionEntry1.path,
    );

    expect(JSON.parse(record.metadata).color).toBe('red');
  });

  it('re-indexes an entry whose file and sidecar changes arrive together', async () => {
    await writeEntryMetadata(
      databaseDirPath(collectionDatabase),
      collectionEntry1.path,
      { color: 'red' },
    );

    // The file change reports contents matching the index, while the
    // sidecar change does not.
    await sync([
      createEntryFileChange(collectionEntry1.database, collectionEntry1.path),
      createEntryFileChange(
        collectionEntry1.database,
        collectionEntry1.path,
        'metadata',
      ),
    ]);

    const record = getRecordByPath(sqlGetEntriesFull(), collectionEntry1.path);

    expect(JSON.parse(record.metadata).color).toBe('red');
  });

  it('leaves an up-to-date sidecar unwritten', async () => {
    const sidecarPath = resolveEntryMetadataFilePath(
      databaseDirPath(collectionDatabase),
      collectionEntry1.path,
    );

    // Write a sidecar with both timestamps, then edit the entry file
    // outside the app.
    await writeEntryMetadata(
      databaseDirPath(collectionDatabase),
      collectionEntry1.path,
      { created: sidecarDate, lastModified: sidecarDate },
    );
    appendToEntryFile(collectionEntry1);

    // Count the writes the sync makes
    const counts = registerCountingMockFileSystem(MockFs);

    try {
      await sync([
        createEntryFileChange(collectionEntry1.database, collectionEntry1.path),
      ]);

      // The entry should have been re-indexed, its sidecar left alone
      expect(resolveUpsertedEntryPaths(collectionDatabase.id)).toEqual([
        collectionEntry1.path,
      ]);
      expect(counts.writes.has(sidecarPath)).toBe(false);
    } finally {
      counts.restore();
    }
  });

  it('indexes into the given workspace rather than the active one', async () => {
    const entryPath = 'New Entry.md';

    // Index the collection database in a second workspace and add a new
    // entry file to it.
    connectTestSqlWorkspace(workspace_2.id);
    seedSqlDatabases(workspace_2.id);
    MockFs.addFiles([
      {
        path: `${workspace_2.path}/${collectionDatabase.path}/${entryPath}`,
        textContent: '---\nRelated: []\n---\n',
      },
    ]);

    await syncEntryFiles(workspace_2.id, workspace_2.path, databases, [
      createEntryFileChange(collectionDatabase.id, entryPath),
    ]);

    expect(
      getRecordByPath(
        sqlGetEntriesFull({ workspaceId: workspace_2.id }),
        entryPath,
      ).databaseId,
    ).toBe(collectionDatabase.id);
    expect(sqlGetEntriesFull().map((record) => record.path)).not.toContain(
      entryPath,
    );
  });

  it('resolves references to entries which were not read', async () => {
    appendToEntryFile(collectionEntry1);

    await sync([
      createEntryFileChange(collectionEntry1.database, collectionEntry1.path),
    ]);

    const collectionRecord = getRecordByPath(
      sqlGetEntriesFull(),
      collectionEntry1.path,
    );

    expect(resolveRecordPropertyValue(collectionRecord, 'Related')).toEqual([
      relatedEntry1.id,
      relatedEntry2.id,
    ]);
  });

  it('keeps an entry whose file cannot be parsed', async () => {
    breakEntryFile(collectionEntry1);

    const changeset = await sync([
      createEntryFileChange(collectionEntry1.database, collectionEntry1.path),
    ]);

    expect(changeset.hasChanges).toBe(false);
    expect(
      sqlGetEntrySyncRecords(collectionDatabase.id).map((record) => record.id),
    ).toContain(collectionEntry1.id);
  });
});

/**
 * Syncs the given entry file changes in the fixture workspace.
 *
 * @param changes - The entry file changes to sync.
 * @returns The sync's result.
 */
function sync(changes: EntryFileChange[]) {
  return syncEntryFiles(workspace_1.id, parentDir, databases, changes);
}
