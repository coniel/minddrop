import { DatabasesStore } from '../DatabasesStore';
import { DatabaseNotFoundError } from '../errors';
import { Database } from '../types';

/**
 * Retrieves a database from the store by ID.
 *
 * @param id - The ID of the database.
 * @param throwOnNotFound - Whether to throw an error if the database is not found.
 * @param workspaceId - The workspace the database belongs to. Omit for the active workspace.
 * @returns The database object.
 *
 * @throws {DatabaseNotFoundError} If the database does not exist.
 */
export function getDatabase(
  id: string,
  throwOnNotFound?: true,
  workspaceId?: string,
): Database;
export function getDatabase(
  id: string,
  throwOnNotFound: false,
  workspaceId?: string,
): Database | null;
export function getDatabase(
  id: string,
  throwOnNotFound = true,
  workspaceId?: string,
): Database | null {
  // Get the database from the workspace's store record
  const database = DatabasesStore.in(workspaceId).get(id);

  // Throw an error if it doesn't exist, unless specified not to
  if (!database && throwOnNotFound) {
    throw new DatabaseNotFoundError(id);
  } else if (!database && !throwOnNotFound) {
    return null;
  }

  return database;
}
