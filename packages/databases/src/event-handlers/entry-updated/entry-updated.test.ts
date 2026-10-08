import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Fs } from '@minddrop/file-system';
import { History } from '@minddrop/history';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { EntriesStore } from '../../EntriesStore';
import { initializeDatabaseEventHandlers } from '../../initializeDatabaseEventHandlers';
import {
  sqlGetEntriesFull,
  sqlUpsertDatabase,
  sqlUpsertEntries,
  syncEntryFiles,
} from '../../sql';
import {
  MockFs,
  cleanup,
  cleanupTestSqlDatabase,
  createEntryFileChange,
  entryFilePath,
  getRecordByPath,
  indexAtCurrentContents,
  objectDatabase,
  objectEntry1,
  objectEntry1SqlRecord,
  resolveRecordPropertyValue,
  seedSqlDatabases,
  setup,
  setupTestSqlDatabase,
} from '../../test-utils';
import { updateEntry } from '../../updateEntry';
import { resolveEntryHistorySubject } from '../../utils';
import { onUpdateEntry } from './entry-updated';

const { workspace_1 } = WorkspaceFixtures;

// The entry with an updated title and property value
const updatedEntry = {
  ...objectEntry1,
  title: 'Renamed Entry',
  properties: {
    ...objectEntry1.properties,
    Content: 'Updated content',
  },
};

// The Content value an in-app edit gives the entry
const editedContent = 'Edited in the app';

describe('onUpdateEntry', () => {
  beforeEach(() => {
    setup();

    // Open an in-memory SQL database
    setupTestSqlDatabase();

    // Seed the entry's database and existing SQL record
    sqlUpsertDatabase(
      {
        id: objectDatabase.id,
        name: objectDatabase.name,
        path: objectDatabase.path,
        icon: objectDatabase.icon,
        properties: objectDatabase.properties,
      },
      { silent: true },
    );
    sqlUpsertEntries(objectDatabase.id, [objectEntry1SqlRecord], {
      silent: true,
    });
  });

  afterEach(async () => {
    cleanupTestSqlDatabase();
    await cleanup();
  });

  it('syncs the updated entry to SQL', async () => {
    // Call the handler with the updated entry
    await onUpdateEntry({ original: objectEntry1, updated: updatedEntry });

    // The SQL record should carry the updated title
    const record = sqlGetEntriesFull().find(
      (entry) => entry.id === objectEntry1.id,
    );

    expect(record?.title).toBe(updatedEntry.title);
  });

  it('syncs the updated property values to SQL', async () => {
    // Call the handler with the updated entry
    await onUpdateEntry({ original: objectEntry1, updated: updatedEntry });

    // The SQL record's property should carry the updated value
    const record = sqlGetEntriesFull().find(
      (entry) => entry.id === objectEntry1.id,
    );
    const contentProperty = record?.properties.find(
      (property) => property.name === 'Content',
    );

    expect(contentProperty?.value).toBe('Updated content');
  });

  it('records the properties the update changed', async () => {
    const updatedEntry = {
      ...objectEntry1,
      properties: { ...objectEntry1.properties, Content: 'Updated content' },
    };

    await onUpdateEntry({ original: objectEntry1, updated: updatedEntry });

    const records = await History.read(
      resolveEntryHistorySubject(objectDatabase, objectEntry1),
    );

    expect(records).toEqual([
      expect.objectContaining({
        kind: 'property',
        changes: [
          {
            property: 'Content',
            from: objectEntry1.properties.Content,
            to: 'Updated content',
          },
        ],
      }),
    ]);
  });

  it('writes and indexes an entry edited in the app', async () => {
    const originalContents = await editEntryInApp();

    // The edit should have reached both the file and the index
    expect(MockFs.readTextFile(entryFilePath(objectEntry1))).not.toBe(
      originalContents,
    );
    expect(
      resolveRecordPropertyValue(
        getRecordByPath(
          sqlGetEntriesFull({ entryIds: [objectEntry1.id] }),
          objectEntry1.path,
        ),
        'Content',
      ),
    ).toBe(editedContent);
  });

  // Pins Issue 48: In-app entry writes never update the indexed contentHash.
  // Remove .fails once fixed.
  it.fails(
    're-indexes an external revert of an entry edited in the app',
    async () => {
      const originalContents = await editEntryInApp();

      // Restore the file's original contents outside the app
      MockFs.writeTextFile(entryFilePath(objectEntry1), originalContents);

      // Sync the changed entry file
      await syncEntryFiles(
        workspace_1.id,
        workspace_1.path,
        [objectDatabase],
        [createEntryFileChange(objectDatabase.id, objectEntry1.path)],
      );

      // Expect the index to have the restored contents. An index left at the
      // edit would overwrite the file on the next edit.
      expect(
        resolveRecordPropertyValue(
          getRecordByPath(
            sqlGetEntriesFull({ entryIds: [objectEntry1.id] }),
            objectEntry1.path,
          ),
          'Content',
        ),
      ).toBe(objectEntry1.properties.Content);
    },
  );

  it('records nothing when the update changed no property', async () => {
    await onUpdateEntry({ original: objectEntry1, updated: objectEntry1 });

    expect(
      await History.read(
        resolveEntryHistorySubject(objectDatabase, objectEntry1),
      ),
    ).toEqual([]);
  });
});

/**
 * Indexes the entries at their contents on disk, then edits objectEntry1
 * in the app with the app's handlers registered.
 *
 * @returns The entry file's contents before the edit.
 */
async function editEntryInApp(): Promise<string> {
  // Read the entry file's original contents
  const originalContents = MockFs.readTextFile(entryFilePath(objectEntry1));

  // Index the entries at their contents on disk, as reading them does
  EntriesStore.update(objectEntry1.id, {
    contentHash: Fs.hashContents(originalContents),
  });
  seedSqlDatabases();
  indexAtCurrentContents();

  // Register the app's handlers, then edit the entry in the app
  initializeDatabaseEventHandlers();
  await updateEntry(objectEntry1.id, {
    properties: { Content: editedContent },
  });
  await Fs.tests.awaitAllOperations();

  return originalContents;
}
