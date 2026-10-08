import { getAllEntries } from '../../getAllEntries';
import { findPathDatabase } from '../findPathDatabase';
import { resolveEntryPropertyFiles } from '../resolveEntryPropertyFiles';

export interface EntryPropertyFileOwner {
  /**
   * The ID of the entry whose property holds the file.
   */
  entryId: string;

  /**
   * The name of the property holding the file.
   */
  property: string;
}

/**
 * Finds the entry property holding the file at a path.
 *
 * Under a storage mode which does not separate entries, entries
 * sharing a file name point at the same file. The first of them is
 * returned.
 *
 * @param path - The absolute path of the file.
 * @param workspacePath - The workspace path. Defaults to the active workspace.
 * @returns The entry and property holding the file, or null if none does.
 */
export function findEntryPropertyFileOwner(
  path: string,
  workspacePath?: string,
): EntryPropertyFileOwner | null {
  // Find the database whose directory holds the file
  const database = findPathDatabase(path, workspacePath);

  // Check if the file is in a database. If not, no entry holds it.
  if (!database) {
    return null;
  }

  // Match the path against the property files of each of the
  // database's entries.
  for (const entry of getAllEntries(database.id)) {
    // Find the entry's property file at the path
    const file = resolveEntryPropertyFiles(entry, { workspacePath }).find(
      (candidate) => candidate.path === path,
    );

    // Return the owner when the entry has the file
    if (file) {
      return { entryId: entry.id, property: file.property };
    }
  }

  // No entry has the file
  return null;
}
