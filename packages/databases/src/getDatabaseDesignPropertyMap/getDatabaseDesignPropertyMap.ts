import { getDatabase } from '../getDatabase';

/**
 * Retrieves the design property map for a database. The map links
 * design property names to this database's own property names.
 *
 * @param databaseId - The ID of the database.
 * @returns The design property map.
 *
 * @throws {DatabaseNotFoundError} If the database does not exist.
 */
export function getDatabaseDesignPropertyMap(
  databaseId: string,
): Record<string, string> {
  // Get the database
  const database = getDatabase(databaseId);

  // Return the design property map
  return database.designPropertyMap;
}
