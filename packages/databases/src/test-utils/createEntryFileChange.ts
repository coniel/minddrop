import { EntryFileChange } from '../types';

/**
 * Creates a change to one of an entry's files.
 *
 * @param databaseId - The ID of the database the entry belongs to.
 * @param path - The entry's path, relative to its database directory.
 * @param file - Which of the entry's files changed.
 * @returns The entry file change.
 */
export function createEntryFileChange(
  databaseId: string,
  path: string,
  file: EntryFileChange['file'] = 'entry',
): EntryFileChange {
  return { databaseId, path, file };
}
