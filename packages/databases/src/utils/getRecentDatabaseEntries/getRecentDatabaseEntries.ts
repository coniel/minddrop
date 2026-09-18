import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import { DatabaseEntry } from '../../types';

export interface GetRecentDatabaseEntriesOptions {
  /**
   * IDs of the databases to include. All databases are included
   * when omitted.
   */
  databases?: string[];

  /**
   * IDs of the entries to leave out.
   */
  exclude?: string[];
}

/**
 * Returns the most recently modified entries sorted by modification
 * date in descending order.
 *
 * @param limit - Maximum number of entries to return.
 * @param options - Which entries to include.
 * @returns The most recently modified entries.
 */
export function getRecentDatabaseEntries(
  limit: number,
  options?: GetRecentDatabaseEntriesOptions,
): DatabaseEntry[] {
  const { databases, exclude } = options ?? {};

  // Get every entry
  const allEntries = DatabaseEntriesStore.getAllArray();

  // Filter entries to the given databases and leave out the
  // excluded ones.
  const entries = allEntries.filter(
    (entry) =>
      (!databases || databases.includes(entry.database)) &&
      !exclude?.includes(entry.id),
  );

  // Sort a copy by modification date, newest first, and cap the
  // result at the limit.
  return [...entries]
    .sort(
      (entryA, entryB) =>
        entryB.lastModified.getTime() - entryA.lastModified.getTime(),
    )
    .slice(0, limit);
}
