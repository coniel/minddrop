import { getDatabase } from '../../getDatabase';
import { getDatabaseEntry } from '../../getDatabaseEntry';
import { databaseEntryAddress } from '../databaseEntryAddress';

/**
 * Serializes an entry ID into the entry's durable address.
 *
 * @param id - The entry ID to serialize.
 * @param workspaceId - The workspace the entry belongs to. Omit for the active workspace.
 * @returns The entry address, or null if the entry or its database does not exist.
 */
export function serializeDatabaseEntryReference(
  id: string,
  workspaceId?: string,
): string | null {
  // Look up the entry to get its current title and database
  const entry = getDatabaseEntry(id, false, workspaceId);

  // IDs that do not resolve cannot be serialized
  if (!entry) {
    return null;
  }

  // Look up the database in the same workspace as the entry
  const database = getDatabase(entry.database, false, workspaceId);

  // Entries whose database is gone cannot be addressed
  if (!database) {
    return null;
  }

  return databaseEntryAddress(entry, database);
}
