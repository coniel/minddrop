import { Database } from '../types';
import { updateDatabase } from '../updateDatabase';

/**
 * Clears the design property map for a database, resetting it
 * to an empty map.
 *
 * @param databaseId - The ID of the database.
 * @returns The updated database.
 *
 * @throws {DatabaseNotFoundError} If the database does not exist.
 */
export async function clearDatabaseDesignPropertyMap(
  databaseId: string,
): Promise<Database> {
  // Reset the design property map
  return updateDatabase(databaseId, { designPropertyMap: {} });
}
