import { fuzzySearch } from '@minddrop/utils';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import { DatabaseEntry } from '../../types';

/**
 * Performs a fuzzy search on entry titles.
 *
 * @param query - The search query.
 * @param databases - IDs of the databases to include. All databases are included when omitted.
 * @returns The matched entries ranked by match quality.
 */
export function searchDatabaseEntriesByTitle(
  query: string,
  databases?: string[],
): DatabaseEntry[] {
  const allEntries = DatabaseEntriesStore.getAllArray();

  // Filter entries to the given databases when provided
  const entries = databases
    ? allEntries.filter((entry) => databases.includes(entry.database))
    : allEntries;

  // Queue up entries per title so that duplicate titles map
  // back to distinct entries
  const entriesByTitle = new Map<string, DatabaseEntry[]>();

  entries.forEach((entry) => {
    const queue = entriesByTitle.get(entry.title) ?? [];

    queue.push(entry);
    entriesByTitle.set(entry.title, queue);
  });

  // Fuzzy match the titles, ranked by match quality
  const matchedTitles = fuzzySearch(
    entries.map((entry) => entry.title),
    query,
  );

  // Map each matched title back to its next queued entry
  return matchedTitles
    .map((title) => entriesByTitle.get(title)?.shift())
    .filter((entry): entry is DatabaseEntry => Boolean(entry));
}
