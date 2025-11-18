import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabaseEntryNotFoundError } from '../errors';
import { DatabaseEntry } from '../types';

/**
 * Retrieves a database entry by its path.
 *
 * @param path - The path of the entry to retrieve.
 * @returns The retrieved entry.
 *
 * @throws {DatabaseEntryNotFoundError} If the entry does not exist.
 */
export function getDatabaseEntry<
  TDatabaseEntry extends DatabaseEntry = DatabaseEntry,
>(path: string): TDatabaseEntry {
  // Get the entry
  const entry = DatabaseEntriesStore.get(path);

  // Ensure the entry exists
  if (!entry) {
    throw new DatabaseEntryNotFoundError(path);
  }

  return entry as TDatabaseEntry;
}
