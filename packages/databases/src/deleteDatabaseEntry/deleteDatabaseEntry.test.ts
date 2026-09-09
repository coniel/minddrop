import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabaseEntryNotFoundError } from '../errors';
import { DatabaseEntryDeletedEvent } from '../events';
import {
  MockFs,
  cleanup,
  commonStorageDatabase,
  commonStorageEntry1,
  databaseDirPath,
  databaseEntryFilePath,
  entryStorageEntry1,
  objectEntry1,
  rootStorageDatabase,
  rootStorageEntry1,
  setup,
  urlEntry1,
} from '../test-utils';
import { objectDatabase } from '../test-utils';
import { resolveEntryMetadataFilePath } from '../utils';
import { writeEntryMetadata } from '../writeEntryMetadata';
import { deleteDatabaseEntry } from './deleteDatabaseEntry';

describe('deleteDatabaseEntry', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the entry does not exist', async () => {
    // Deleting a missing entry should throw
    await expect(deleteDatabaseEntry('missing')).rejects.toThrow(
      DatabaseEntryNotFoundError,
    );
  });

  it('moves the entry file to the system trash', async () => {
    await deleteDatabaseEntry(objectEntry1.id);

    // The entry file should now be in the trash
    expect(MockFs.existsInTrash(databaseEntryFilePath(objectEntry1))).toBe(
      true,
    );
    expect(MockFs.exists(databaseEntryFilePath(objectEntry1))).toBe(false);
  });

  it('trashes loose property files for root storage', async () => {
    await deleteDatabaseEntry(rootStorageEntry1.id);

    // The entry's file-property file should now be in the trash
    const propertyFilePath = `${databaseDirPath(rootStorageDatabase)}/image.png`;
    expect(MockFs.existsInTrash(propertyFilePath)).toBe(true);
  });

  it('trashes property files in shared property directories', async () => {
    await deleteDatabaseEntry(commonStorageEntry1.id);

    // The entry's file-property file should now be in the trash
    const propertyFilePath = `${databaseDirPath(commonStorageDatabase)}/${commonStorageDatabase.propertyFilesDir}/image.png`;
    expect(MockFs.existsInTrash(propertyFilePath)).toBe(true);
  });

  it('trashes the entry subdirectory for entry-based storage', async () => {
    await deleteDatabaseEntry(entryStorageEntry1.id);

    // The entry's subdirectory should now be in the trash
    const entryDirPath = Fs.parentDirPath(
      databaseEntryFilePath(entryStorageEntry1),
    );
    expect(MockFs.existsInTrash(entryDirPath)).toBe(true);
  });

  it('removes the entry from the store', async () => {
    await deleteDatabaseEntry(objectEntry1.id);

    // The store should no longer contain the entry
    expect(DatabaseEntriesStore).not.toHaveItem(objectEntry1.id);
  });

  it('leaves other entries intact', async () => {
    await deleteDatabaseEntry(objectEntry1.id);

    // Other entries should remain in the store
    expect(DatabaseEntriesStore).toHaveItem(urlEntry1.id);
  });

  it('dispatches an entry deleted event', async () =>
    new Promise<void>((done) => {
      Events.addListener(DatabaseEntryDeletedEvent, 'test', (data) => {
        // Payload should be the deleted entry
        expect(data).toEqual(objectEntry1);
        done();
      });

      deleteDatabaseEntry(objectEntry1.id);
    }));

  it("deletes the entry's metadata sidecar", async () => {
    const sidecarPath = resolveEntryMetadataFilePath(
      databaseDirPath(objectDatabase),
      databaseEntryFilePath(objectEntry1),
    );

    // Give the entry a sidecar
    await writeEntryMetadata(
      databaseDirPath(objectDatabase),
      databaseEntryFilePath(objectEntry1),
      {
        embeddedViewConfigs: { 'card:Tasks': { options: {}, data: {} } },
      },
    );

    await deleteDatabaseEntry(objectEntry1.id);

    // The sidecar would otherwise be orphaned in the metadata directory
    expect(MockFs.exists(sidecarPath)).toBe(false);
  });
});
