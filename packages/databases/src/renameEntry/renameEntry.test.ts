import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { EntriesStore } from '../EntriesStore';
import { DatabaseHistoryCauses } from '../constants';
import { EntryRenamedEvent } from '../events';
import {
  MockFs,
  cleanup,
  entryFilePath,
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
