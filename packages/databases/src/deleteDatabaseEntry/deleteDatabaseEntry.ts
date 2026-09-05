import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabaseEntryDeletedEvent } from '../events';
import { getDatabase } from '../getDatabase';
import { getDatabaseEntry } from '../getDatabaseEntry';
import {
  resolveEntryMetadataFilePath,
  resolveEntryPropertyFilePaths,
} from '../utils';

/**
 * Deletes a database entry, moving its files to the system trash.
 *
 * @param id - The ID of the entry to delete.
 *
 * @throws {DatabaseEntryNotFoundError} If the entry does not exist.
 * @throws {DatabaseNotFoundError} If the entry's database does not exist.
 *
 * @dispatches databases:entry:deleted
 */
export async function deleteDatabaseEntry(id: string): Promise<void> {
  // Get the entry, throwing if it does not exist
  const entry = getDatabaseEntry(id);

  // Get the entry's database
  const database = getDatabase(entry.database);

  // Resolve the entry's property file paths. The resolver reads the
  // entry from the store, so we need to collect the paths before
  // removing the entry from the store.
  const propertyFilePaths = resolveEntryPropertyFilePaths(id);

  // Remove the entry from the store
  DatabaseEntriesStore.remove(id);

  // Dispatch the delete event
  Events.dispatch(DatabaseEntryDeletedEvent, entry);

  // Entry-based storage keeps the entry file and its property files in a
  // per-entry subdirectory, so trashing the subdirectory removes them all
  if (database.propertyFileStorage === 'entry') {
    // Trash the entry's subdirectory
    await Fs.trashDir(Fs.parentDirPath(entry.path));
  } else {
    // Trash the entry file
    await Fs.trashFile(entry.path);

    // Trash each of the entry's file-property files
    for (const propertyFilePath of propertyFilePaths) {
      // Only trash files that exist
      if (await Fs.exists(propertyFilePath)) {
        await Fs.trashFile(propertyFilePath);
      }
    }
  }

  // Remove the entry's metadata sidecar, which would otherwise be
  // orphaned in the metadata directory
  const metadataFilePath = resolveEntryMetadataFilePath(
    database.path,
    entry.path,
  );

  if (await Fs.exists(metadataFilePath)) {
    await Fs.removeFile(metadataFilePath);
  }
}
