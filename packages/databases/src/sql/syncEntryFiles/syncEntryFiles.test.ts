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
  collectionDatabase,
  collectionEntry1,
  databaseDirPath,
  databases,
  entryFileChange,
  entryFilePath,
  indexAtCurrentContents,
  parentDir,
  propertyValue,
  recordByPath,
  relatedEntry1,
  relatedEntry2,
  seedSqlDatabases,
  setup,
  setupRecordingTestSqlDatabase,
  timestampEntry1,
  upsertedEntryPaths,
} from '../../test-utils';
import { EntryFileChange } from '../../types';
import { resolveEntryMetadataFilePath } from '../../utils';
import { writeEntryMetadata } from '../../writeEntryMetadata';
import { sqlGetEntriesFull } from '../sqlGetEntriesFull';
import { sqlGetEntrySyncRecords } from '../sqlGetEntrySyncRecords';
import { syncEntryFiles } from './syncEntryFiles';

const { workspace_1 } = WorkspaceFixtures;

// A new entry file's stat dates
const statDate = new Date('2026-02-02T00:00:00.000Z');

describe('syncEntryFiles', () => {
  beforeEach(() => {
    setup();

    // Open a recording in-memory SQL database
    setupRecordingTestSqlDatabase();

    // Seed each fixture database's SQL record
    seedSqlDatabases();

    // Index the fixture entries at the contents on disk, so that
    // nothing appears changed until a file is edited.
    indexAtCurrentContents();
  });

  afterEach(async () => {
    cleanupRecordingTestSqlDatabase();
    await cleanup();
  });

  it('re-indexes an entry whose file changed under its existing ID', async () => {
    appendToEntryFile(timestampEntry1);

    const changeset = await sync([
      entryFileChange(timestampEntry1.database, timestampEntry1.path),
    ]);

    expect(changeset.upsertedEntries.map((record) => record.id)).toEqual([
      timestampEntry1.id,
    ]);

    // The record should be indexed at the new contents
    const record = sqlGetEntrySyncRecords(timestampEntry1.database).find(
      ({ id }) => id === timestampEntry1.id,
    );

    expect(record?.contentHash).toBe(
      Fs.hashContents(MockFs.readTextFile(entryFilePath(timestampEntry1))),
    );
  });

  it('only re-indexes the changed entries', async () => {
    appendToEntryFile(collectionEntry1);

    await sync([
      entryFileChange(collectionEntry1.database, collectionEntry1.path),
    ]);

    // No other entry of any database, the changed entry's own
    // included, should be upserted.
    databases.forEach((database) => {
      expect(upsertedEntryPaths(database.id)).toEqual(
        database.id === collectionDatabase.id ? [collectionEntry1.path] : [],
      );
    });
  });

  it('does not re-index an entry whose contents match the index', async () => {
    const changeset = await sync([
      entryFileChange(timestampEntry1.database, timestampEntry1.path),
    ]);

    expect(changeset.hasChanges).toBe(false);
    expect(upsertedEntryPaths(timestampEntry1.database)).toEqual([]);
  });

  it('indexes a new entry', async () => {
    MockFs.addFiles([
      {
        path: `${databaseDirPath(collectionDatabase)}/New Entry.md`,
        textContent: '---\nRelated: []\n---\n',
      },
    ]);

    const changeset = await sync([
      entryFileChange(collectionDatabase.id, 'New Entry.md'),
    ]);

    expect(changeset.upsertedEntries.map((record) => record.path)).toEqual([
      'New Entry.md',
    ]);
  });

  it("seeds a new entry's sidecar with its stat derived timestamps", async () => {
    const path = `${databaseDirPath(collectionDatabase)}/New Entry.md`;

    MockFs.addFiles([{ path, textContent: '---\nRelated: []\n---\n' }]);
    MockFs.setFileStats(path, { created: statDate, lastModified: statDate });

    await sync([entryFileChange(collectionDatabase.id, 'New Entry.md')]);

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
      entryFileChange(collectionDatabase.id, 'New A.md'),
      entryFileChange(collectionDatabase.id, 'New B.md'),
    ]);

    const records = sqlGetEntriesFull();
    const recordA = recordByPath(records, 'New A.md');
    const recordB = recordByPath(records, 'New B.md');

    expect(propertyValue(recordA, 'Related')).toEqual([recordB.id]);
    expect(propertyValue(recordB, 'Related')).toEqual([recordA.id]);
  });

  it('deletes an entry whose file is gone', async () => {
    MockFs.removeFile(entryFilePath(collectionEntry1));

    const changeset = await sync([
      entryFileChange(collectionEntry1.database, collectionEntry1.path),
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
      entryFileChange(collectionEntry1.database, collectionEntry1.path),
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
      entryFileChange(collectionDatabase.id, 'Gone.md'),
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
      entryFileChange(
        collectionEntry1.database,
        collectionEntry1.path,
        'metadata',
      ),
    ]);

    expect(JSON.parse(changeset.upsertedEntries[0].metadata).color).toBe('red');
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
      entryFileChange(collectionEntry1.database, collectionEntry1.path),
      entryFileChange(
        collectionEntry1.database,
        collectionEntry1.path,
        'metadata',
      ),
    ]);

    const record = recordByPath(sqlGetEntriesFull(), collectionEntry1.path);

    expect(JSON.parse(record.metadata).color).toBe('red');
  });

  it('resolves references to entries which were not read', async () => {
    appendToEntryFile(collectionEntry1);

    await sync([
      entryFileChange(collectionEntry1.database, collectionEntry1.path),
    ]);

    const collectionRecord = recordByPath(
      sqlGetEntriesFull(),
      collectionEntry1.path,
    );

    expect(propertyValue(collectionRecord, 'Related')).toEqual([
      relatedEntry1.id,
      relatedEntry2.id,
    ]);
  });

  it('keeps an entry whose file cannot be parsed', async () => {
    breakEntryFile(collectionEntry1);

    const changeset = await sync([
      entryFileChange(collectionEntry1.database, collectionEntry1.path),
    ]);

    expect(changeset.hasChanges).toBe(false);
    expect(
      sqlGetEntrySyncRecords(collectionDatabase.id).map((record) => record.id),
    ).toContain(collectionEntry1.id);
  });
});

/**
 * Syncs the given entry file changes in the fixture workspace.
 */
function sync(changes: EntryFileChange[]) {
  return syncEntryFiles(workspace_1.id, parentDir, databases, changes);
}
