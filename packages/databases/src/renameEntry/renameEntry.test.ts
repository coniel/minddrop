import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { storeItem } from '@minddrop/stores/test-utils';
import { EntriesStore } from '../EntriesStore';
import { DatabaseHistoryCauses } from '../constants';
import { EntryRenamedEvent } from '../events';
import {
  MockFs,
  cleanup,
  databaseDirPath,
  entryFilePath,
  entryStorageDatabase,
  entryStorageEntry1,
  objectEntry1,
  setup,
} from '../test-utils';
import { renameEntry } from './renameEntry';

describe('renameEntry', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the name conflicts with an existing entry', async () => {
    await expect(
      renameEntry(objectEntry1.id, objectEntry1.title),
    ).rejects.toThrow(Fs.errors.PathConflict);
  });

  it("renames the entry's primary file", async () => {
    await renameEntry(objectEntry1.id, 'Renamed Entry');

    const newPath = 'Renamed Entry.md';
    const newFilePath = `${Fs.parentDirPath(entryFilePath(objectEntry1))}/${newPath}`;

    expect(MockFs.exists(newFilePath)).toBe(true);
    expect(MockFs.exists(entryFilePath(objectEntry1))).toBe(false);
  });

  it('increments the title if a conflict exists and incrementTitleIfConflict is true', async () => {
    const newName = 'Renamed Entry';
    const newPath = `${newName} 1.md`;
    const newFilePath = `${Fs.parentDirPath(entryFilePath(objectEntry1))}/${newPath}`;

    // Add a conflicting file
    MockFs.addFiles([
      `${Fs.parentDirPath(entryFilePath(objectEntry1))}/${newName}.md`,
    ]);

    const renamedEntry = await renameEntry(objectEntry1.id, newName, true);

    expect(renamedEntry.title).toBe(`${newName} 1`);
    expect(renamedEntry.path).toBe(newPath);
    expect(MockFs.exists(newFilePath)).toBe(true);
    expect(MockFs.exists(entryFilePath(objectEntry1))).toBe(false);
  });

  // Pins Issue 29: renameEntry renames the entry file's parent directory. This
  // can be the database directory. Remove .fails once fixed.
  it.fails(
    'leaves the database directory in place when renaming an entry file at the root of an entry-directory database',
    async () => {
      // A file dropped at the database root, indexed as an entry
      const rootLevelEntry = {
        ...entryStorageEntry1,
        id: 'database-entry_root-level' as const,
        title: 'Dropped',
        path: 'Dropped.md',
      };

      // Add the entry and its file
      EntriesStore.set(rootLevelEntry);
      MockFs.addFiles([entryFilePath(rootLevelEntry)]);

      // Rename the entry, ignoring a rejection. Refusing the rename is
      // acceptable. Moving the database directory is not.
      await renameEntry(rootLevelEntry.id, 'Renamed Entry').catch(() => null);

      // The database directory and the entries inside it stay where they are
      expect(MockFs.exists(databaseDirPath(entryStorageDatabase))).toBe(true);
      expect(MockFs.exists(entryFilePath(entryStorageEntry1))).toBe(true);
    },
  );

  // Pins Issue 65: Case-only title changes are silently discarded on
  // case-insensitive file systems. Remove .fails once fixed.
  it.fails(
    'renames an entry to a title differing only in case on a case-insensitive file system',
    async () => {
      // Uppercase the entry's title
      const newTitle = objectEntry1.title.toUpperCase();

      // Rename the entry on the case-insensitive mock file system
      await renameEntry(objectEntry1.id, newTitle);

      // Expect the store to have the new title
      expect(storeItem(EntriesStore, objectEntry1.id).title).toBe(newTitle);
    },
  );

  it('updates the entry title, path, and last modified date, keeping its ID', async () => {
    const renamedEntry = await renameEntry(objectEntry1.id, 'Renamed Entry');

    expect(renamedEntry.id).toBe(objectEntry1.id);
    expect(renamedEntry.title).toBe('Renamed Entry');
    expect(renamedEntry.path).toBe('Renamed Entry.md');
    expect(renamedEntry.lastModified.getTime()).toBeGreaterThan(
      objectEntry1.lastModified.getTime(),
    );
  });

  it('updates the entry in the store in place', async () => {
    const renamedEntry = await renameEntry(objectEntry1.id, 'Renamed Entry');

    // The entry should be updated under its existing key
    expect(EntriesStore).toHaveItem(objectEntry1.id, renamedEntry);
  });

  it('never adds a second entry to the store during the rename', async () => {
    const initialCount = EntriesStore.getAllArray().length;
    let maxCount = initialCount;

    // Track the store's item count across every state change
    const unsubscribe = EntriesStore.useStore.subscribe((state) => {
      maxCount = Math.max(maxCount, Object.keys(state.items).length);
    });

    await renameEntry(objectEntry1.id, 'Renamed Entry');

    unsubscribe();

    // The rename must not create a transient duplicate entry
    expect(maxCount).toBe(initialCount);
  });

  it('writes the updated entry file', async () => {
    await renameEntry(objectEntry1.id, 'Renamed Entry');

    const newPath = 'Renamed Entry.md';
    const newFilePath = `${Fs.parentDirPath(entryFilePath(objectEntry1))}/${newPath}`;

    expect(MockFs.exists(newFilePath)).toBe(true);
  });

  it('dispatches an entry rename event', async () =>
    new Promise<void>((done) => {
      Events.addListener(EntryRenamedEvent, 'test', (payload) => {
        // Payload data should contain the original and updated entry,
        // and the action performing the rename.
        expect(payload).toEqual({
          original: objectEntry1,
          updated: {
            ...objectEntry1,
            title: 'Renamed Entry',
            path: 'Renamed Entry.md',
            lastModified: expect.any(Date),
          },
          action: {
            id: expect.stringMatching(/^action_/),
            cause: DatabaseHistoryCauses.EntryRenamed,
          },
        });
        done();
      });

      renameEntry(objectEntry1.id, 'Renamed Entry');
    }));
});
