import { getDatabase } from '../getDatabase';
import { DesignPropertyMap } from '../types';

/**
 * Retrieves a design property map for the specified design from a database.
 *
 * @param databaseId - The ID of the database.
 * @param designId - The ID of the design.
 * @returns The design property map or null if it doesn't exist.
 */
export function getDatabaseDesignPropertyMap(
  databaseId: string,
  designId: string,
): DesignPropertyMap | null {
  // Get the database
  const database = getDatabase(databaseId);

  // Return the design property map if it exists
  return database.designPropertyMaps[designId] || null;
}
