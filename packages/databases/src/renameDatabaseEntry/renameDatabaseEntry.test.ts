import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { Fs, PathConflictError } from '@minddrop/file-system';
import { Properties } from '@minddrop/properties';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabaseEntryRenamedEvent } from '../events';
import {
  MockFs,
  cleanup,
  objectDatabase,
  objectEntry1,
  setup,
} from '../test-utils';
import { entryAssetsDirPath, entryCorePropertiesFilePath } from '../utils';
import { renameDatabaseEntry } from './renameDatabaseEntry';

const corePropertiesDirPath = Fs.parentDirPath(
  entryCorePropertiesFilePath(objectEntry1.path),
);

describe('renameDatabaseEntry', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the name conflicts with an existing entry', async () => {
    await expect(
      renameDatabaseEntry(objectEntry1.path, objectEntry1.title),
    ).rejects.toThrow(PathConflictError);
  });

  it("renames the entry's primary file", async () => {
    await renameDatabaseEntry(objectEntry1.path, 'Renamed DatabaseEntry');

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
      objectEntry1.path,
      newName,
      true,
    );

    expect(renamedDatabaseEntry.title).toBe(`${newName} 1`);
    expect(renamedDatabaseEntry.path).toBe(newPath);
    expect(MockFs.exists(newPath)).toBe(true);
    expect(MockFs.exists(objectEntry1.path)).toBe(false);
  });

  it("renames the entry's core properties file", async () => {
    await renameDatabaseEntry(objectEntry1.path, 'Renamed DatabaseEntry');

    const oldPath = `${corePropertiesDirPath}/${objectEntry1.title}.yaml`;
    const newPath = `${corePropertiesDirPath}/Renamed DatabaseEntry.yaml`;

    expect(MockFs.exists(newPath)).toBe(true);
    expect(MockFs.exists(oldPath)).toBe(false);
  });

  it("renames the entry's assets directory", async () => {
    const assetsDirPath = entryAssetsDirPath(objectEntry1.path);

    // Add the entry's assets directory
    MockFs.addFiles([assetsDirPath]);

    await renameDatabaseEntry(objectEntry1.path, 'Renamed DatabaseEntry');

    const newAssetsDirPath = entryAssetsDirPath(
      `${Fs.parentDirPath(objectEntry1.path)}/Renamed DatabaseEntry.md`,
    );

    expect(MockFs.exists(newAssetsDirPath)).toBe(true);
    expect(MockFs.exists(assetsDirPath)).toBe(false);
  });

  it('updates the entry title, path, and last modified date', async () => {
    const renamedDatabaseEntry = await renameDatabaseEntry(
      objectEntry1.path,
      'Renamed DatabaseEntry',
    );

    expect(renamedDatabaseEntry.title).toBe('Renamed DatabaseEntry');
    expect(renamedDatabaseEntry.path).toBe(
      `${Fs.parentDirPath(objectEntry1.path)}/Renamed DatabaseEntry.md`,
    );
    expect(renamedDatabaseEntry.lastModified.getTime()).toBeGreaterThan(
      objectEntry1.lastModified.getTime(),
    );
  });

  it('updates the entry in the store', async () => {
    const renamedDatabaseEntry = await renameDatabaseEntry(
      objectEntry1.path,
      'Renamed DatabaseEntry',
    );

    expect(DatabaseEntriesStore.get(renamedDatabaseEntry.path)).toEqual(
      renamedDatabaseEntry,
    );
  });

  it('updates the entry core properties file', async () => {
    await renameDatabaseEntry(objectEntry1.path, 'Renamed DatabaseEntry');

    const coreProperties = MockFs.readTextFile(
      `${corePropertiesDirPath}/Renamed DatabaseEntry.yaml`,
    );

    expect(
      Properties.fromYaml(objectDatabase.properties, coreProperties).title,
    ).toBe('Renamed DatabaseEntry');
  });

  it('dispatches a entry rename event', async () =>
    new Promise<void>(async (done) => {
      Events.addListener(DatabaseEntryRenamedEvent, 'test', (payload) => {
        // Payload data should be the renamed entry
        expect(payload.data).toEqual({
          ...objectEntry1,
          title: 'Renamed DatabaseEntry',
          path: `${Fs.parentDirPath(objectEntry1.path)}/Renamed DatabaseEntry.md`,
          lastModified: expect.any(Date),
        });
        done();
      });

      renameDatabaseEntry(objectEntry1.path, 'Renamed DatabaseEntry');
    }));
});
