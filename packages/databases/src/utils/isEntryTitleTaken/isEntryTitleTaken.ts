import { EntriesStore } from '../../EntriesStore';

/**
 * Checks whether an entry title is already in use within a
 * database. The check is case-insensitive because entry titles
 * double as file names on a potentially case-insensitive file
 * system.
 *
 * @param databaseId - The ID of the database to check in.
 * @param title - The title to check for.
 * @param excludeEntryId - ID of an entry to exclude from the check.
 * @returns Whether the title is taken.
 */
export function isEntryTitleTaken(
  databaseId: string,
  title: string,
  excludeEntryId?: string,
): boolean {
  // Compare titles case-insensitively
  const normalizedTitle = title.toLowerCase();

  return EntriesStore.getAllArray().some(
    (entry) =>
      entry.database === databaseId &&
      entry.id !== excludeEntryId &&
      entry.title.toLowerCase() === normalizedTitle,
  );
}
