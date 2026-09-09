import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabaseNotFoundError } from '../errors';
import { DatabaseEntriesClearedEvent } from '../events';
import { getAllDatabaseEntries } from '../getAllDatabaseEntries';
import {
  MockFs,
  cleanup,
  commonStorageDatabase,
  databaseDirPath,
  databaseEntryFilePath,
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
    expect(MockFs.existsInTrash(databaseEntryFilePath(objectEntry1))).toBe(
      true,
    );
    expect(MockFs.exists(databaseEntryFilePath(objectEntry1))).toBe(false);
  });

  it('trashes the shared property directory for common storage', async () => {
    await clearDatabaseEntries(commonStorageDatabase.id);

    // The common property directory should now be in the trash
    const propertyDirPath = `${databaseDirPath(commonStorageDatabase)}/${commonStorageDatabase.propertyFilesDir}`;
    expect(MockFs.existsInTrash(propertyDirPath)).toBe(true);
  });

  it('trashes per-property directories for property storage', async () => {
    await clearDatabaseEntries(propertyStorageDatabase.id);

    // The file-based property's directory should now be in the trash
    const propertyDirPath = `${databaseDirPath(propertyStorageDatabase)}/Image`;
    expect(MockFs.existsInTrash(propertyDirPath)).toBe(true);
  });

  it('trashes loose property files for root storage', async () => {
    await clearDatabaseEntries(rootStorageDatabase.id);

    // The entry's file-property file should now be in the trash
    const propertyFilePath = `${databaseDirPath(rootStorageDatabase)}/image.png`;
    expect(MockFs.existsInTrash(propertyFilePath)).toBe(true);
  });

  it('trashes the entry subdirectory for entry-based storage', async () => {
    await clearDatabaseEntries(entryStorageDatabase.id);

    // The entry's subdirectory should now be in the trash
    const entryDirPath = Fs.parentDirPath(
      databaseEntryFilePath(entryStorageEntry1),
    );
    expect(MockFs.existsInTrash(entryDirPath)).toBe(true);
  });

  it("removes the database's entries from the store", async () => {
    await clearDatabaseEntries(objectDatabase.id);

    // The store should no longer contain any of the database's entries
    expect(getAllDatabaseEntries(objectDatabase.id)).toHaveLength(0);
    expect(DatabaseEntriesStore).not.toHaveItem(objectEntry1.id);
  });

  it("leaves other databases' entries intact", async () => {
    await clearDatabaseEntries(objectDatabase.id);

    // Entries belonging to other databases should remain
    expect(DatabaseEntriesStore).toHaveItem(urlEntry1.id);
    expect(getAllDatabaseEntries(urlDatabase.id).length).toBeGreaterThan(0);
  });

  it('dispatches a single entries cleared event', async () =>
    new Promise<void>((done) => {
      // Capture the database's entries before clearing
      const entries = getAllDatabaseEntries(objectDatabase.id);

      Events.addListener(DatabaseEntriesClearedEvent, 'test', (data) => {
        // Payload should carry the database ID and the deleted entries
        expect(data.databaseId).toBe(objectDatabase.id);
        expect(data.entries).toEqual(entries);
        done();
      });

      clearDatabaseEntries(objectDatabase.id);
    }));

  it('does not dispatch when the database has no entries', async () => {
    // Clear the object database so it has no entries left
    await clearDatabaseEntries(objectDatabase.id);

    // Listen for a cleared event on the now-empty database
    let dispatched = false;
    Events.addListener(DatabaseEntriesClearedEvent, 'test', () => {
      dispatched = true;
    });

    await clearDatabaseEntries(objectDatabase.id);

    // No event should have been dispatched
    expect(dispatched).toBe(false);
  });
});
