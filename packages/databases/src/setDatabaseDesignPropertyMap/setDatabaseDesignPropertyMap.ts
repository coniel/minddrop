import { getDatabase } from '../getDatabase';
import { Database, DesignPropertyMap } from '../types';
import { updateDatabase } from '../updateDatabase';

/**
 * Sets a design property map for a database.
 *
 * @param databaseId - The ID of the database.
 * @param designId - The ID of the design.
 * @param propertyMap - The design property map.
 * @returns The updated database.
 */
export async function setDatabaseDesignPropertyMap(
  databaseId: string,
  designId: string,
  propertyMap: DesignPropertyMap,
): Promise<Database> {
  // Get the database
  const database = getDatabase(databaseId);

  // Set the design property map on the database
  return updateDatabase(databaseId, {
    designPropertyMaps: {
      ...database.designPropertyMaps,
      [designId]: propertyMap,
    },
  });
}
