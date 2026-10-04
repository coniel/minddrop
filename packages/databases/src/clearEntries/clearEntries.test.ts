import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { EntriesStore } from '../EntriesStore';
import { DatabaseNotFoundError } from '../errors';
import { EntriesClearedEvent } from '../events';
import { getAllEntries } from '../getAllEntries';
import {
  MockFs,
  cleanup,
  commonStorageDatabase,
  databaseDirPath,
  entryFilePath,
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
import { clearEntries } from './clearEntries';

describe('clearEntries', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the database does not exist', async () => {
    // Clearing a missing database should throw
    await expect(clearEntries('missing')).rejects.toThrow(
      DatabaseNotFoundError,
    );
  });

  it('moves the entry files to the system trash', async () => {
    await clearEntries(objectDatabase.id);

    // The entry file should now be in the trash
    expect(MockFs.existsInTrash(entryFilePath(objectEntry1))).toBe(true);
    expect(MockFs.exists(entryFilePath(objectEntry1))).toBe(false);
  });

  it('trashes the shared property directory for common storage', async () => {
    await clearEntries(commonStorageDatabase.id);

    // The common property directory should now be in the trash
    const propertyDirPath = `${databaseDirPath(commonStorageDatabase)}/${commonStorageDatabase.propertyFilesDir}`;
    expect(MockFs.existsInTrash(propertyDirPath)).toBe(true);
  });

  it('trashes per-property directories for property storage', async () => {
    await clearEntries(propertyStorageDatabase.id);

    // The file-based property's directory should now be in the trash
    const propertyDirPath = `${databaseDirPath(propertyStorageDatabase)}/Image`;
    expect(MockFs.existsInTrash(propertyDirPath)).toBe(true);
  });

  it('trashes loose property files for root storage', async () => {
    await clearEntries(rootStorageDatabase.id);

    // The entry's file-property file should now be in the trash
    const propertyFilePath = `${databaseDirPath(rootStorageDatabase)}/image.png`;
    expect(MockFs.existsInTrash(propertyFilePath)).toBe(true);
  });

  it('trashes the entry subdirectory for entry-based storage', async () => {
    await clearEntries(entryStorageDatabase.id);

    // The entry's subdirectory should now be in the trash
    const entryDirPath = Fs.parentDirPath(entryFilePath(entryStorageEntry1));
    expect(MockFs.existsInTrash(entryDirPath)).toBe(true);
  });

  it("removes the database's entries from the store", async () => {
    await clearEntries(objectDatabase.id);

    // The store should no longer contain any of the database's entries
    expect(getAllEntries(objectDatabase.id)).toHaveLength(0);
    expect(EntriesStore).not.toHaveItem(objectEntry1.id);
  });

  it("leaves other databases' entries intact", async () => {
    await clearEntries(objectDatabase.id);

    // Entries belonging to other databases should remain
    expect(EntriesStore).toHaveItem(urlEntry1.id);
    expect(getAllEntries(urlDatabase.id).length).toBeGreaterThan(0);
  });

  it('dispatches a single entries cleared event', async () =>
    new Promise<void>((done) => {
      // Capture the database's entries before clearing
      const entries = getAllEntries(objectDatabase.id);

      Events.addListener(EntriesClearedEvent, 'test', (data) => {
        // Payload should carry the database ID and the deleted entries
        expect(data.databaseId).toBe(objectDatabase.id);
        expect(data.entries).toEqual(entries);
        done();
      });

      clearEntries(objectDatabase.id);
    }));

  it('does not dispatch when the database has no entries', async () => {
    // Clear the object database so it has no entries left
    await clearEntries(objectDatabase.id);

    // Listen for a cleared event on the now-empty database
    let dispatched = false;
    Events.addListener(EntriesClearedEvent, 'test', () => {
      dispatched = true;
    });

    await clearEntries(objectDatabase.id);

    // No event should have been dispatched
    expect(dispatched).toBe(false);
  });
});
