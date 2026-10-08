import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { EntriesStore } from '../EntriesStore';
import { EntryNotFoundError } from '../errors';
import { EntryDeletedEvent } from '../events';
import {
  MockFs,
  cleanup,
  commonStorageDatabase,
  commonStorageEntry1,
  databaseDirPath,
  entryFilePath,
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
import { deleteEntry } from './deleteEntry';

describe('deleteEntry', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the entry does not exist', async () => {
    // Deleting a missing entry should throw
    await expect(deleteEntry('missing')).rejects.toThrow(EntryNotFoundError);
  });

  it('moves the entry file to the system trash', async () => {
    await deleteEntry(objectEntry1.id);

    // The entry file should now be in the trash
    expect(MockFs.existsInTrash(entryFilePath(objectEntry1))).toBe(true);
    expect(MockFs.exists(entryFilePath(objectEntry1))).toBe(false);
  });

  it('trashes loose property files for root storage', async () => {
    await deleteEntry(rootStorageEntry1.id);

    // The entry's file-property file should now be in the trash
    const propertyFilePath = `${databaseDirPath(rootStorageDatabase)}/image.png`;
    expect(MockFs.existsInTrash(propertyFilePath)).toBe(true);
  });

  it('trashes property files in shared property directories', async () => {
    await deleteEntry(commonStorageEntry1.id);

    // The entry's file-property file should now be in the trash
    const propertyFilePath = `${databaseDirPath(commonStorageDatabase)}/${commonStorageDatabase.propertyFilesDir}/image.png`;
    expect(MockFs.existsInTrash(propertyFilePath)).toBe(true);
  });

  it('trashes the entry subdirectory for entry-based storage', async () => {
    await deleteEntry(entryStorageEntry1.id);

    // The entry's subdirectory should now be in the trash
    const entryDirPath = Fs.parentDirPath(entryFilePath(entryStorageEntry1));
    expect(MockFs.existsInTrash(entryDirPath)).toBe(true);
  });

  // Pins Issue 29: deleteEntry treats the entry file's parent directory as the
  // entry's own. Remove .fails once fixed.
  it.fails(
    "leaves the directory's own entry in place when deleting a second file indexed from it",
    async () => {
      // A sync client's conflict copy indexed from the entry's directory
      const conflictedCopy = {
        ...entryStorageEntry1,
        id: 'database-entry_conflicted-copy' as const,
        title: `${entryStorageEntry1.title} (conflicted copy)`,
        path: `${Fs.parentDirPath(entryStorageEntry1.path)}/${entryStorageEntry1.title} (conflicted copy).md`,
      };

      EntriesStore.set(conflictedCopy);
      MockFs.addFiles([entryFilePath(conflictedCopy)]);

      await deleteEntry(conflictedCopy.id);

      // The conflict copy should be gone, and the directory's own entry
      // file should survive the delete.
      expect(MockFs.exists(entryFilePath(conflictedCopy))).toBe(false);
      expect(MockFs.exists(entryFilePath(entryStorageEntry1))).toBe(true);
    },
  );

  it('removes the entry from the store', async () => {
    await deleteEntry(objectEntry1.id);

    // The store should no longer contain the entry
    expect(EntriesStore).not.toHaveItem(objectEntry1.id);
  });

  it('leaves other entries intact', async () => {
    await deleteEntry(objectEntry1.id);

    // Other entries should remain in the store
    expect(EntriesStore).toHaveItem(urlEntry1.id);
  });

  it('dispatches an entry deleted event', async () =>
    new Promise<void>((done) => {
      Events.addListener(EntryDeletedEvent, 'test', (data) => {
        // Payload should be the deleted entry
        expect(data).toEqual(objectEntry1);
        done();
      });

      deleteEntry(objectEntry1.id);
    }));

  it("deletes the entry's metadata sidecar", async () => {
    const sidecarPath = resolveEntryMetadataFilePath(
      databaseDirPath(objectDatabase),
      entryFilePath(objectEntry1),
    );

    // Give the entry a sidecar
    await writeEntryMetadata(
      databaseDirPath(objectDatabase),
      entryFilePath(objectEntry1),
      {
        color: 'red',
      },
    );

    await deleteEntry(objectEntry1.id);

    // Should remove the entry's metadata sidecar
    expect(MockFs.exists(sidecarPath)).toBe(false);
  });
});
