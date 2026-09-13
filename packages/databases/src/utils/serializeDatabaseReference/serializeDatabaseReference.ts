import { getDatabase } from '../../getDatabase';

/**
 * Serializes a database ID into the database's durable address, its
 * name.
 *
 * @param id - The database ID to serialize.
 * @param workspaceId - The workspace the database belongs to. Omit for the active workspace.
 * @returns The database address, or null if the database does not exist.
 */
export function serializeDatabaseReference(
  id: string,
  workspaceId?: string,
): string | null {
  // Look up the database to get its current name
  const database = getDatabase(id, false, workspaceId);

  // IDs that do not resolve cannot be serialized
  if (!database) {
    return null;
  }

  return database.name;
}
