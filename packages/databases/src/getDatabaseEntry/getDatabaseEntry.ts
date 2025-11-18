import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabaseEntryNotFoundError } from '../errors';
import { DatabaseEntry } from '../types';

/**
 * Retrieves a database entry by its path.
 *
 * @param id - The ID of the entry to retrieve.
 * @returns The retrieved entry.
 *
 * @throws {DatabaseEntryNotFoundError} If the entry does not exist.
 */
export function getDatabaseEntry<
  TDatabaseEntry extends DatabaseEntry = DatabaseEntry,
>(id: string): TDatabaseEntry {
  // Get the entry
  const entry = DatabaseEntriesStore.get(id);

  // Ensure the entry exists
  if (!entry) {
    throw new DatabaseEntryNotFoundError(id);
  }

  return entry as TDatabaseEntry;
}
