import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabaseEntriesClearedEvent } from '../events';
import { getAllDatabaseEntries } from '../getAllDatabaseEntries';
import { getDatabase } from '../getDatabase';
import {
  resolveEntryPropertyFilePaths,
  resolveDatabasePropertyDirs,
} from '../utils';

/**
 * Deletes all of a database's entries, moving their files to the system
 * trash. The database and its configuration are left intact.
 *
 * @param databaseId - The ID of the database to clear.
 *
 * @throws {DatabaseNotFoundError} If the database does not exist.
 *
 * @dispatches databases:entries:cleared
 */
export async function clearDatabaseEntries(databaseId: string): Promise<void> {
  // Get the database, throwing if it does not exist
  const database = getDatabase(databaseId);

  // Get all of the database's entries
  const entries = getAllDatabaseEntries(databaseId);

  // Nothing to do if the database has no entries
  if (entries.length === 0) {
    return;
  }

  // Trash each entry's files and remove it from the store
  for (const entry of entries) {
    // Entry-based storage keeps the entry file and its property files in a
    // per-entry subdirectory, so trashing the subdirectory removes them all
    if (database.propertyFileStorage === 'entry') {
      // Trash the entry's subdirectory
      await Fs.trashDir(Fs.parentDirPath(entry.path));
    } else {
      // Trash the entry file
      await Fs.trashFile(entry.path);

      // Root storage keeps property files loose in the database root, so
      // trash each of the entry's file-property files individually
      if (database.propertyFileStorage === 'root') {
        for (const propertyFilePath of resolveEntryPropertyFilePaths(entry.id)) {
          // Only trash files that exist
          if (await Fs.exists(propertyFilePath)) {
            await Fs.trashFile(propertyFilePath);
          }
        }
      }
    }

    // Remove the entry from the store
    DatabaseEntriesStore.remove(entry.id);
  }

  // Trash the database's shared property directories as a whole, since every
  // entry that could own files in them has been cleared
  for (const propertyDirPath of resolveDatabasePropertyDirs(database)) {
    // Only trash directories that exist
    if (await Fs.exists(propertyDirPath)) {
      await Fs.trashDir(propertyDirPath);
    }
  }

  // Dispatch a single cleared event with all deleted entries
  await Events.dispatch(DatabaseEntriesClearedEvent, { databaseId, entries });
}
