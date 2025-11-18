import { Events } from '@minddrop/events';
import { Fs, PathConflictError } from '@minddrop/file-system';
import { titleFromPath } from '@minddrop/utils';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabaseEntryRenamedEvent } from '../events';
import { getDatabaseEntry } from '../getDatabaseEntry';
import { DatabaseEntry } from '../types';
import { entryAssetsDirPath, entryCorePropertiesFilePath } from '../utils';
import { writeDatabaseEntry } from '../writeDatabaseEntry';

/**
 * Renames an entry, updating its title and the file names of its associated
 * files.
 *
 * @param path - The path of the entry to rename.
 * @param newTitle - The new title for the entry.
 * @returns The renamed entry.
 *
 * @throws {PathConflictError} Thrown if an entry already exists at the new path.
 */
export async function renameDatabaseEntry<
  TDatabaseEntry extends DatabaseEntry = DatabaseEntry,
>(
  path: string,
  newTitle: string,
  incrementTitleIfConflict = false,
): Promise<TDatabaseEntry> {
  let finalNewTitle = newTitle;
  const entry = getDatabaseEntry<TDatabaseEntry>(path);
  const parentDir = Fs.parentDirPath(path);
  const corePropertiesPath = entryCorePropertiesFilePath(path);
  const fileExtension = Fs.getFileExtension(path);
  const newFileName = `${newTitle}.${fileExtension}`;
  let newPath = Fs.concatPath(parentDir, newFileName);

  // Ensure that there is no conflict at the new path
  if (await Fs.exists(newPath)) {
    if (!incrementTitleIfConflict) {
      throw new PathConflictError(newPath);
    }

    // Get an incremental path to avoid the conflict
    const { path, name } = await Fs.incrementalPath(newPath);

    finalNewTitle = titleFromPath(name);
    newPath = path;
  }

  // Rename the primary entry file
  Fs.rename(path, newPath);
  // Rename the entry's core properties file
  Fs.rename(corePropertiesPath, entryCorePropertiesFilePath(newPath));

  // Rename the entry's assets directory if it exists
  const assetsDirPath = entryAssetsDirPath(path);

  if (await Fs.exists(assetsDirPath)) {
    const newAssetsDirPath = entryAssetsDirPath(newPath);
    Fs.rename(assetsDirPath, newAssetsDirPath);
  }

  // Update the entry's title, path, and last modified date
  const renamedDatabaseEntry: TDatabaseEntry = {
    ...entry,
    path: newPath,
    title: finalNewTitle,
    lastModified: new Date(),
  };

  // Update the entry in the store by adding the renamed entry
  // and removing the old entry.
  DatabaseEntriesStore.add(renamedDatabaseEntry);
  DatabaseEntriesStore.remove(path);

  // Write the updated core properties to the renamed core properties file
  writeDatabaseEntry(newPath);

  // Dispatch an entry rename event
  Events.dispatch(DatabaseEntryRenamedEvent, renamedDatabaseEntry);

  // Return the renamed entry
  return renamedDatabaseEntry;
}
