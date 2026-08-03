import { Events } from '@minddrop/events';
import { Fs, PathConflictError } from '@minddrop/file-system';
import { titleFromPath } from '@minddrop/utils';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import {
  DatabaseEntryRenamedEvent,
  DatabaseEntryRenamedEventData,
} from '../events';
import { getDatabase } from '../getDatabase';
import { getDatabaseEntry } from '../getDatabaseEntry';
import { DatabaseEntry } from '../types';
import { entryAssetsDirPath } from '../utils';
import { writeDatabaseEntry } from '../writeDatabaseEntry';

/**
 * Renames an entry, updating its title and the file names of its associated
 * files.
 *
 * @param id - The ID of the entry to rename.
 * @param newTitle - The new title for the entry.
 * @returns The renamed entry.
 *
 * @throws {PathConflictError} Thrown if an entry already exists at the new path.
 */
export async function renameDatabaseEntry<
  TDatabaseEntry extends DatabaseEntry = DatabaseEntry,
>(
  id: string,
  newTitle: string,
  incrementTitleIfConflict = false,
): Promise<TDatabaseEntry> {
  let finalNewTitle = newTitle;
  const entry = getDatabaseEntry<TDatabaseEntry>(id);
  const parentDir = Fs.parentDirPath(entry.path);
  const fileExtension = Fs.getFileExtension(entry.path);
  const entryFileNameWithoutExt = Fs.removeExtension(
    Fs.fileNameFromPath(entry.path),
  );

  // Check if the entry is stored in its own subdirectory
  const database = getDatabase(entry.database);
  const isInEntrySubdir = database.propertyFileStorage === 'entry';

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

  if (isInEntrySubdir) {
    // Rename the entry's subdirectory, which moves the entry file
    // and all associated files within it to the new directory
    const grandParentDir = Fs.parentDirPath(parentDir);
    const newEntryDir = Fs.concatPath(grandParentDir, finalNewTitle);

    await Fs.rename(parentDir, newEntryDir);

    // The entry file is now at the old file name inside the new directory.
    // Compute its current path and the final path with the new file name.
    const currentEntryPath = Fs.concatPath(
      newEntryDir,
      `${entryFileNameWithoutExt}.${fileExtension}`,
    );

    newPath = Fs.concatPath(newEntryDir, `${finalNewTitle}.${fileExtension}`);

    // Rename the entry file inside the renamed directory
    await Fs.rename(currentEntryPath, newPath);
  } else {
    // Rename the primary entry file
    await Fs.rename(entry.path, newPath);

    // Rename the entry's assets directory if it exists
    const assetsDirPath = entryAssetsDirPath(entry.path);

    if (await Fs.exists(assetsDirPath)) {
      const newAssetsDirPath = entryAssetsDirPath(newPath);

      await Fs.rename(assetsDirPath, newAssetsDirPath);
    }
  }

  // Update the entry's path, title, and last modified date
  const renamedDatabaseEntry: TDatabaseEntry = {
    ...entry,
    path: newPath,
    title: finalNewTitle,
    lastModified: new Date(),
  };

  // Update the entry in place under its existing store key
  DatabaseEntriesStore.update(id, {
    path: newPath,
    title: finalNewTitle,
    lastModified: renamedDatabaseEntry.lastModified,
  });

  // Write the updated entry file
  await writeDatabaseEntry(id);

  // Dispatch the rename event
  await Events.dispatch<DatabaseEntryRenamedEventData>(
    DatabaseEntryRenamedEvent,
    {
      original: entry,
      updated: renamedDatabaseEntry,
    },
  );

  // Return the renamed entry
  return renamedDatabaseEntry;
}
