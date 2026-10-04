import { getDatabase } from '../../getDatabase';
import { getEntry } from '../../getEntry';
import { entryAddress } from '../entryAddress';

/**
 * Serializes an entry ID into the entry's durable address.
 *
 * @param id - The entry ID to serialize.
 * @param workspaceId - The workspace the entry belongs to. Omit for the active workspace.
 * @returns The entry address, or null if the entry or its database does not exist.
 */
export function serializeEntryReference(
  id: string,
  workspaceId?: string,
): string | null {
  // Look up the entry to get its current title and database
  const entry = getEntry(id, false, workspaceId);

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

  return entryAddress(entry, database);
}
