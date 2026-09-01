import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabaseEntryDeletedEvent } from '../events';
import { getDatabase } from '../getDatabase';
import { getDatabaseEntry } from '../getDatabaseEntry';
import {
  resolveEntryPropertyFilePaths,
  resolveEntryMetadataFilePath,
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

  // Entry-based storage keeps the entry file and its property files in a
  // per-entry subdirectory, so trashing the subdirectory removes them all
  if (database.propertyFileStorage === 'entry') {
    // Trash the entry's subdirectory
    await Fs.trashDir(Fs.parentDirPath(entry.path));
  } else {
    // Trash the entry file
    await Fs.trashFile(entry.path);

    // Trash each of the entry's file-property files
    for (const propertyFilePath of resolveEntryPropertyFilePaths(entry.id)) {
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

  // Dispatch the delete event before removing the entry from the
  // store so consumers can tear down while it is still resolvable
  await Events.dispatch(DatabaseEntryDeletedEvent, entry);

  // Remove the entry from the store
  DatabaseEntriesStore.remove(id);
}
