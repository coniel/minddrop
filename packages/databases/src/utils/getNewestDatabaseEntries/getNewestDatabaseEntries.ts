import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import { DatabaseEntry } from '../../types';

/**
 * Returns the newest entries sorted by creation date in
 * descending order.
 *
 * @param limit - Maximum number of entries to return.
 * @param databases - IDs of the databases to include. All databases are included when omitted.
 * @returns The newest entries.
 */
export function getNewestDatabaseEntries(
  limit: number,
  databases?: string[],
): DatabaseEntry[] {
  const allEntries = DatabaseEntriesStore.getAllArray();

  // Filter entries to the given databases when provided
  const entries = databases
    ? allEntries.filter((entry) => databases.includes(entry.database))
    : allEntries;

  // Sort a copy by creation date, newest first, and cap the
  // result at the limit
  return [...entries]
    .sort(
      (entryA, entryB) => entryB.created.getTime() - entryA.created.getTime(),
    )
    .slice(0, limit);
}
