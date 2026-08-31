import { DatabaseEntriesStore } from '../DatabaseEntriesStore';

/**
 * Returns database entries as an array.
 *
 * @param databaseId - The ID of the database to return the entries of. Omit to return every entry in the workspace.
 * @returns The entries.
 */
export function getAllDatabaseEntries(databaseId?: string) {
  const entries = DatabaseEntriesStore.getAllArray();

  // Return every entry when no database is named
  if (!databaseId) {
    return entries;
  }

  return entries.filter((entry) => entry.database === databaseId);
}
