import { Database } from '../types';
import { updateDatabase } from '../updateDatabase';

/**
 * Sets the design property map for a database, replacing the
 * existing map. Keys are design property names, values are
 * this database's own property names.
 *
 * @param databaseId - The ID of the database.
 * @param designPropertyMap - The design property map.
 * @returns The updated database.
 *
 * @throws {DatabaseNotFoundError} If the database does not exist.
 */
export async function setDatabaseDesignPropertyMap(
  databaseId: string,
  designPropertyMap: Record<string, string>,
): Promise<Database> {
  // Replace the design property map
  return updateDatabase(databaseId, { designPropertyMap });
}
