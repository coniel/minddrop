import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import { DatabaseEntry } from '../../types';

/**
 * Returns the most recently modified entries sorted by modification
 * date in descending order.
 *
 * @param limit - Maximum number of entries to return.
 * @param databases - IDs of the databases to include. All databases are included when omitted.
 * @returns The most recently modified entries.
 */
export function getRecentDatabaseEntries(
  limit: number,
  databases?: string[],
): DatabaseEntry[] {
  const allEntries = DatabaseEntriesStore.getAllArray();

  // Filter entries to the given databases when provided
  const entries = databases
    ? allEntries.filter((entry) => databases.includes(entry.database))
    : allEntries;

  // Sort a copy by modification date, newest first, and cap the
  // result at the limit
  return [...entries]
    .sort(
      (entryA, entryB) =>
        entryB.lastModified.getTime() - entryA.lastModified.getTime(),
    )
    .slice(0, limit);
}
