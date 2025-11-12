import { DatabasesStore } from '../DatabasesStore';
import { DatabaseNotFoundError } from '../errors';
import { Database } from '../types';

/**
 * Retrieves a database from the store by name.
 *
 * @param name - The name of the database.
 * @param throwOnNotFound - Whether to throw an error if the database is not found.
 * @returns The database object.
 *
 * @throws {DatabaseNotFoundError} If the database does not exist.
 */
export function getDatabase(name: string): Database;
export function getDatabase(
  type: string,
  throwOnNotFound: false,
): Database | null;
export function getDatabase(
  type: string,
  throwOnNotFound = true,
): Database | null {
  // Get the database from the store
  const database = DatabasesStore.get(type);

  // Throw an error if it doesn't exist, unless specified not to
  if (!database && throwOnNotFound) {
    throw new DatabaseNotFoundError(type);
  } else if (!database && !throwOnNotFound) {
    return null;
  }

  return database;
}
