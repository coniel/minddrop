import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabaseNotFoundError } from '../errors';
import {
  DatabaseEntriesClearedEvent,
  DatabaseEntriesClearedEventData,
} from '../events';
import { getAllDatabaseEntries } from '../getAllDatabaseEntries';
import {
  MockFs,
  cleanup,
  commonStorageDatabase,
  entryStorageDatabase,
  entryStorageEntry1,
  objectDatabase,
  objectEntry1,
  propertyStorageDatabase,
  rootStorageDatabase,
  setup,
  urlDatabase,
  urlEntry1,
} from '../test-utils';
import { entryAssetsDirPath } from '../utils';
import { clearDatabaseEntries } from './clearDatabaseEntries';

describe('clearDatabaseEntries', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the database does not exist', async () => {
    // Clearing a missing database should throw
    await expect(clearDatabaseEntries('missing')).rejects.toThrow(
      DatabaseNotFoundError,
    );
  });

  it('moves the entry files to the system trash', async () => {
    await clearDatabaseEntries(objectDatabase.id);

    // The entry file should now be in the trash
    expect(MockFs.existsInTrash(objectEntry1.path)).toBe(true);
    expect(MockFs.exists(objectEntry1.path)).toBe(false);
  });

  it("trashes an entry's assets directory if it has one", async () => {
    // Add an assets directory for the entry
    const assetsDirPath = entryAssetsDirPath(objectEntry1.path);
    MockFs.addFiles([`${assetsDirPath}/asset.png`]);

    await clearDatabaseEntries(objectDatabase.id);

    // The assets directory should now be in the trash
    expect(MockFs.existsInTrash(assetsDirPath)).toBe(true);
  });

  it('trashes the shared property directory for common storage', async () => {
    await clearDatabaseEntries(commonStorageDatabase.id);

    // The common property directory should now be in the trash
    const propertyDirPath = `${commonStorageDatabase.path}/${commonStorageDatabase.propertyFilesDir}`;
    expect(MockFs.existsInTrash(propertyDirPath)).toBe(true);
  });

  it('trashes per-property directories for property storage', async () => {
    await clearDatabaseEntries(propertyStorageDatabase.id);

    // The file-based property's directory should now be in the trash
    const propertyDirPath = `${propertyStorageDatabase.path}/Image`;
    expect(MockFs.existsInTrash(propertyDirPath)).toBe(true);
  });

  it('trashes loose property files for root storage', async () => {
    await clearDatabaseEntries(rootStorageDatabase.id);

    // The entry's file-property file should now be in the trash
    const propertyFilePath = `${rootStorageDatabase.path}/image.png`;
    expect(MockFs.existsInTrash(propertyFilePath)).toBe(true);
  });

  it('trashes the entry subdirectory for entry-based storage', async () => {
    await clearDatabaseEntries(entryStorageDatabase.id);

    // The entry's subdirectory should now be in the trash
    const entryDirPath = Fs.parentDirPath(entryStorageEntry1.path);
    expect(MockFs.existsInTrash(entryDirPath)).toBe(true);
  });

  it("removes the database's entries from the store", async () => {
    await clearDatabaseEntries(objectDatabase.id);

    // The store should no longer contain any of the database's entries
    expect(getAllDatabaseEntries(objectDatabase.id)).toHaveLength(0);
    expect(DatabaseEntriesStore.get(objectEntry1.id)).toBeNull();
  });

  it("leaves other databases' entries intact", async () => {
    await clearDatabaseEntries(objectDatabase.id);

    // Entries belonging to other databases should remain
    expect(DatabaseEntriesStore.get(urlEntry1.id)).not.toBeNull();
    expect(getAllDatabaseEntries(urlDatabase.id).length).toBeGreaterThan(0);
  });

  it('dispatches a single entries cleared event', async () =>
    new Promise<void>((done) => {
      // Capture the database's entries before clearing
      const entries = getAllDatabaseEntries(objectDatabase.id);

      Events.addListener<DatabaseEntriesClearedEventData>(
        DatabaseEntriesClearedEvent,
        'test',
        ({ data }) => {
          // Payload should carry the database ID and the deleted entries
          expect(data.databaseId).toBe(objectDatabase.id);
          expect(data.entries).toEqual(entries);
          done();
        },
      );

      clearDatabaseEntries(objectDatabase.id);
    }));

  it('does not dispatch when the database has no entries', async () => {
    // Clear the object database so it has no entries left
    await clearDatabaseEntries(objectDatabase.id);

    // Listen for a cleared event on the now-empty database
    let dispatched = false;
    Events.addListener<DatabaseEntriesClearedEventData>(
      DatabaseEntriesClearedEvent,
      'test',
      () => {
        dispatched = true;
      },
    );

    await clearDatabaseEntries(objectDatabase.id);

    // No event should have been dispatched
    expect(dispatched).toBe(false);
  });
});
