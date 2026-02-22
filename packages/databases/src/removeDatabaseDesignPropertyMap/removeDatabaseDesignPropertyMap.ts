import { getDatabase } from '../getDatabase';
import { Database } from '../types';
import { updateDatabase } from '../updateDatabase';

/**
 * Removes a design property map from a database.
 *
 * @param databaseId - The ID of the database.
 * @param designId - The ID of the design.
 * @returns The updated database.
 */
export function removeDatabaseDesignPropertyMap(
  databaseId: string,
  designId: string,
): Promise<Database> {
  // Get the database
  const database = getDatabase(databaseId);

  // Remove the target design property map
  const { [designId]: _, ...remainingPropertyMaps } =
    database.designPropertyMaps;

  // Update the database
  return updateDatabase(databaseId, {
    designPropertyMaps: remainingPropertyMaps,
  });
}
