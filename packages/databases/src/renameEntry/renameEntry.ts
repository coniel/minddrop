import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { History } from '@minddrop/history';
import { titleFromPath } from '@minddrop/utils';
import { EntriesStore } from '../EntriesStore';
import { DatabaseHistoryCauses } from '../constants';
import { EntryRenamedEvent } from '../events';
import { getDatabase } from '../getDatabase';
import { getEntry } from '../getEntry';
import { Entry } from '../types';
import { resolveDatabasePath, resolveEntryPath } from '../utils';
import { writeEntry } from '../writeEntry';

/**
 * Renames an entry, updating its title and the file names of its associated
 * files.
 *
 * @param id - The ID of the entry to rename.
 * @param newTitle - The new title for the entry.
 * @returns The renamed entry.
 *
 * @throws {Fs.errors.PathConflict} Thrown if an entry already exists at the new path.
 */
export async function renameEntry<TEntry extends Entry = Entry>(
  id: string,
  newTitle: string,
  incrementTitleIfConflict = false,
): Promise<TEntry> {
  let finalNewTitle = newTitle;
  const entry = getEntry<TEntry>(id);
  const database = getDatabase(entry.database);
  const databasePath = resolveDatabasePath(database);
  const entryPath = resolveEntryPath(entry, database);
  const parentDir = Fs.parentDirPath(entryPath);
  const fileExtension = Fs.getFileExtension(entryPath);
  const entryFileNameWithoutExt = Fs.removeExtension(
    Fs.fileNameFromPath(entryPath),
  );

  // Check if the entry is stored in its own subdirectory
  const isInEntrySubdir = database.propertyFileStorage === 'entry';

  const newFileName = `${newTitle}.${fileExtension}`;
  let newPath = Fs.concatPath(parentDir, newFileName);

  // Ensure that there is no conflict at the new path
  if (await Fs.exists(newPath)) {
    if (!incrementTitleIfConflict) {
      throw new Fs.errors.PathConflict(newPath);
    }

    // Get an incremental path to avoid the conflict
    const { path, name } = await Fs.incrementalPath(newPath);

    finalNewTitle = titleFromPath(name);
    newPath = path;
  }

  if (isInEntrySubdir) {
    // Rename the entry's subdirectory, which moves the entry file
    // and all associated files within it to the new directory.
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
    await Fs.rename(entryPath, newPath);
  }

  // The entry's new path, as addressed from its database
  const newRelativePath = Fs.relativePath(databasePath, newPath);

  // Update the entry's path, title, and last modified date
  const renamedEntry: TEntry = {
    ...entry,
    path: newRelativePath,
    title: finalNewTitle,
    lastModified: new Date(),
  };

  // Update the entry in place under its existing store key
  EntriesStore.update(id, {
    path: newRelativePath,
    title: finalNewTitle,
    lastModified: renamedEntry.lastModified,
  });

  // Dispatch the rename event
  Events.dispatch(EntryRenamedEvent, {
    original: entry,
    updated: renamedEntry,
    action: History.createAction(DatabaseHistoryCauses.EntryRenamed),
  });

  // Write the updated entry file
  await writeEntry(id);

  // Return the renamed entry
  return renamedEntry;
}
