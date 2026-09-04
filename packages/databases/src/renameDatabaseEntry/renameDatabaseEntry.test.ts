import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { Fs, PathConflictError } from '@minddrop/file-system';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabaseEntryRenamedEvent } from '../events';
import { MockFs, cleanup, objectEntry1, setup } from '../test-utils';
import { renameDatabaseEntry } from './renameDatabaseEntry';

describe('renameDatabaseEntry', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the name conflicts with an existing entry', async () => {
    await expect(
      renameDatabaseEntry(objectEntry1.id, objectEntry1.title),
    ).rejects.toThrow(PathConflictError);
  });

  it("renames the entry's primary file", async () => {
    await renameDatabaseEntry(objectEntry1.id, 'Renamed DatabaseEntry');

    const newPath = `${Fs.parentDirPath(objectEntry1.path)}/Renamed DatabaseEntry.md`;

    expect(MockFs.exists(newPath)).toBe(true);
    expect(MockFs.exists(objectEntry1.path)).toBe(false);
  });

  it('increments the title if a conflict exists and incrementTitleIfConflict is true', async () => {
    const newName = 'Renamed DatabaseEntry';
    const newPath = `${Fs.parentDirPath(objectEntry1.path)}/${newName} 1.md`;

    // Add a conflicting file
    MockFs.addFiles([`${Fs.parentDirPath(objectEntry1.path)}/${newName}.md`]);

    const renamedDatabaseEntry = await renameDatabaseEntry(
      objectEntry1.id,
      newName,
      true,
    );

    expect(renamedDatabaseEntry.title).toBe(`${newName} 1`);
    expect(renamedDatabaseEntry.path).toBe(newPath);
    expect(MockFs.exists(newPath)).toBe(true);
    expect(MockFs.exists(objectEntry1.path)).toBe(false);
  });

  it('updates the entry title, path, and last modified date, keeping its ID', async () => {
    const renamedDatabaseEntry = await renameDatabaseEntry(
      objectEntry1.id,
      'Renamed DatabaseEntry',
    );

    expect(renamedDatabaseEntry.id).toBe(objectEntry1.id);
    expect(renamedDatabaseEntry.title).toBe('Renamed DatabaseEntry');
    expect(renamedDatabaseEntry.path).toBe(
      `${Fs.parentDirPath(objectEntry1.path)}/Renamed DatabaseEntry.md`,
    );
    expect(renamedDatabaseEntry.lastModified.getTime()).toBeGreaterThan(
      objectEntry1.lastModified.getTime(),
    );
  });

  it('updates the entry in the store in place', async () => {
    const renamedDatabaseEntry = await renameDatabaseEntry(
      objectEntry1.id,
      'Renamed DatabaseEntry',
    );

    // The entry should be updated under its existing key
    expect(DatabaseEntriesStore.get(objectEntry1.id)).toEqual(
      renamedDatabaseEntry,
    );
  });

  it('never adds a second entry to the store during the rename', async () => {
    const initialCount = DatabaseEntriesStore.getAllArray().length;
    let maxCount = initialCount;

    // Track the store's item count across every state change
    const unsubscribe = DatabaseEntriesStore.useStore.subscribe((state) => {
      maxCount = Math.max(maxCount, Object.keys(state.items).length);
    });

    await renameDatabaseEntry(objectEntry1.id, 'Renamed DatabaseEntry');

    unsubscribe();

    // The rename must not create a transient duplicate entry
    expect(maxCount).toBe(initialCount);
  });

  it('writes the updated entry file', async () => {
    await renameDatabaseEntry(objectEntry1.id, 'Renamed DatabaseEntry');

    const newPath = `${Fs.parentDirPath(objectEntry1.path)}/Renamed DatabaseEntry.md`;

    expect(MockFs.exists(newPath)).toBe(true);
  });

  it('dispatches an entry rename event', async () =>
    new Promise<void>((done) => {
      Events.addListener(DatabaseEntryRenamedEvent, 'test', (payload) => {
        // Payload data should contain the original and updated entry
        expect(payload).toEqual({
          original: objectEntry1,
          updated: {
            ...objectEntry1,
            title: 'Renamed DatabaseEntry',
            path: `${Fs.parentDirPath(objectEntry1.path)}/Renamed DatabaseEntry.md`,
            lastModified: expect.any(Date),
          },
        });
        done();
      });

      renameDatabaseEntry(objectEntry1.id, 'Renamed DatabaseEntry');
    }));
});
