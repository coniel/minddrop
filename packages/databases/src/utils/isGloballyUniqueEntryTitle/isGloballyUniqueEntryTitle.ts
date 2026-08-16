import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';

/**
 * Checks whether an entry title is used by only one entry across every
 * database. The check is case-insensitive because entry titles double as
 * file names on a potentially case-insensitive file system.
 *
 * A title which no entry uses counts as unique, so this answers "would this
 * title name one entry?" rather than "does this title exist?".
 *
 * @param title - The title to check.
 * @param excludeEntryId - ID of an entry to exclude from the check.
 * @returns Whether the title names at most one entry.
 */
export function isGloballyUniqueEntryTitle(
  title: string,
  excludeEntryId?: string,
): boolean {
  // Compare titles case-insensitively
  const normalizedTitle = title.toLowerCase();

  const matches = DatabaseEntriesStore.getAllArray().filter(
    (entry) =>
      entry.id !== excludeEntryId &&
      entry.title.toLowerCase() === normalizedTitle,
  );

  return matches.length <= 1;
}
