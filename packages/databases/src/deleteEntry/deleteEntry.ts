import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { EntriesStore } from '../EntriesStore';
import { EntryDeletedEvent } from '../events';
import { getDatabase } from '../getDatabase';
import { getEntry } from '../getEntry';
import { removeEntryMetadataFile } from '../removeEntryMetadataFile';
import {
  resolveDatabasePath,
  resolveEntryPath,
  resolveEntryPropertyFilePaths,
} from '../utils';

/**
 * Deletes a database entry, moving its files to the system trash.
 *
 * @param id - The ID of the entry to delete.
 *
 * @throws {EntryNotFoundError} If the entry does not exist.
 * @throws {DatabaseNotFoundError} If the entry's database does not exist.
 *
 * @dispatches databases:entry:deleted
 */
export async function deleteEntry(id: string): Promise<void> {
  // Get the entry, throwing if it does not exist
  const entry = getEntry(id);

  // Get the entry's database
  const database = getDatabase(entry.database);
  const databasePath = resolveDatabasePath(database);
  const entryPath = resolveEntryPath(entry, database);

  // Resolve the entry's property file paths. The resolver reads the
  // entry from the store, so we need to collect the paths before
  // removing the entry from the store.
  const propertyFilePaths = resolveEntryPropertyFilePaths(id);

  // Remove the entry from the store
  EntriesStore.remove(id);

  // Dispatch the delete event
  Events.dispatch(EntryDeletedEvent, entry);

  // Entry-based storage keeps the entry file and its property files in a
  // per-entry subdirectory, so trashing the subdirectory removes them all.
  if (database.propertyFileStorage === 'entry') {
    // Trash the entry's subdirectory
    await Fs.trashDir(Fs.parentDirPath(entryPath));
  } else {
    // Trash the entry file
    await Fs.trashFile(entryPath);

    // Trash each of the entry's file-property files
    for (const propertyFilePath of propertyFilePaths) {
      // Only trash files that exist
      if (await Fs.exists(propertyFilePath)) {
        await Fs.trashFile(propertyFilePath);
      }
    }
  }

  // Remove the entry's metadata sidecar
  await removeEntryMetadataFile(databasePath, entryPath);
}
