import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabasesStore } from '../DatabasesStore';
import { Database } from '../types';

/**
 * Retrieves a unique list of databases that have entries
 * matching the provided entry IDs.
 *
 * @param entryIds - The IDs of the entries to look up.
 * @returns A unique list of databases.
 */
export function getDatabasesFromEntries(entryIds: string[]): Database[] {
  // Collect unique database IDs from the matching entries
  const databaseIds = new Set<string>();

  for (const entryId of entryIds) {
    // Get the entry from the store
    const entry = DatabaseEntriesStore.get(entryId);

    // Skip entries that don't exist
    if (entry) {
      databaseIds.add(entry.database);
    }
  }

  // Resolve each database ID to a Database object
  const databases: Database[] = [];

  for (const databaseId of databaseIds) {
    const database = DatabasesStore.get(databaseId);

    if (database) {
      databases.push(database);
    }
  }

  return databases;
}
