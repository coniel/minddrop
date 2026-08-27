import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabaseEntryNotFoundError } from '../errors';
import { DatabaseEntry } from '../types';

/**
 * Retrieves a database entry by its ID.
 *
 * @param id - The ID of the entry to retrieve.
 * @param throwOnNotFound - Whether to throw when the entry does not exist. Defaults to true.
 * @returns The retrieved entry, or null when not found and not throwing.
 *
 * @throws {DatabaseEntryNotFoundError} If the entry does not exist and throwing is enabled.
 */
export function getDatabaseEntry<
  TDatabaseEntry extends DatabaseEntry = DatabaseEntry,
>(id: string, throwOnNotFound?: true): TDatabaseEntry;
export function getDatabaseEntry<
  TDatabaseEntry extends DatabaseEntry = DatabaseEntry,
>(id: string, throwOnNotFound: false): TDatabaseEntry | null;
export function getDatabaseEntry<
  TDatabaseEntry extends DatabaseEntry = DatabaseEntry,
>(id: string, throwOnNotFound = true): TDatabaseEntry | null {
  // Get the entry
  const entry = DatabaseEntriesStore.get(id);

  // Handle the entry not existing
  if (!entry) {
    if (throwOnNotFound) {
      throw new DatabaseEntryNotFoundError(id);
    }

    return null;
  }

  return entry as TDatabaseEntry;
}
