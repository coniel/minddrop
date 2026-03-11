import { DatabaseEntriesStore } from './DatabaseEntriesStore';

/**
 * Returns all entries for a database as an array.
 */
export function getAllDatabaseEntries(databaseId: string) {
  return DatabaseEntriesStore.getAllArray().filter(
    (entry) => entry.database === databaseId,
  );
}
