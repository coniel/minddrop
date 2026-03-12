import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { Fs, PathConflictError } from '@minddrop/file-system';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabaseEntryRenamedEvent } from '../events';
import {
  MockFs,
  cleanup,
  objectDatabase,
  objectEntry1,
  setup,
} from '../test-utils';
import { entryAssetsDirPath } from '../utils';
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

  it("renames the entry's assets directory", async () => {
    const assetsDirPath = entryAssetsDirPath(objectEntry1.path);

    // Add the entry's assets directory
    MockFs.addFiles([assetsDirPath]);

    await renameDatabaseEntry(objectEntry1.id, 'Renamed DatabaseEntry');

    const newAssetsDirPath = entryAssetsDirPath(
      `${Fs.parentDirPath(objectEntry1.path)}/Renamed DatabaseEntry.md`,
    );

    expect(MockFs.exists(newAssetsDirPath)).toBe(true);
    expect(MockFs.exists(assetsDirPath)).toBe(false);
  });

  it('updates the entry id, title, path, and last modified date', async () => {
    const renamedDatabaseEntry = await renameDatabaseEntry(
      objectEntry1.id,
      'Renamed DatabaseEntry',
    );

    expect(renamedDatabaseEntry.id).toBe(
      `${objectDatabase.name}/Renamed DatabaseEntry.md`,
    );
    expect(renamedDatabaseEntry.title).toBe('Renamed DatabaseEntry');
    expect(renamedDatabaseEntry.path).toBe(
      `${Fs.parentDirPath(objectEntry1.path)}/Renamed DatabaseEntry.md`,
    );
    expect(renamedDatabaseEntry.lastModified.getTime()).toBeGreaterThan(
      objectEntry1.lastModified.getTime(),
    );
  });

  it('updates the entry in the store under the new ID', async () => {
    const renamedDatabaseEntry = await renameDatabaseEntry(
      objectEntry1.id,
      'Renamed DatabaseEntry',
    );

    // New ID should exist in the store
    expect(DatabaseEntriesStore.get(renamedDatabaseEntry.id)).toEqual(
      renamedDatabaseEntry,
    );

    // Old ID should no longer exist
    expect(DatabaseEntriesStore.get(objectEntry1.id)).toBeNull();
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
        expect(payload.data).toEqual({
          original: objectEntry1,
          updated: {
            ...objectEntry1,
            id: `${objectDatabase.name}/Renamed DatabaseEntry.md`,
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
