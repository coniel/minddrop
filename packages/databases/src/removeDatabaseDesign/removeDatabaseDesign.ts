import { getDatabase } from '../getDatabase';
import { Database } from '../types';
import { updateDatabase } from '../updateDatabase';

/**
 * Removes a design from a database.
 *
 * @param databaseId - The ID of the database to remove the design from.
 * @param designId - The ID of the design to remove.
 * @returns The updated database config.
 */
export function removeDatabaseDesign(
  databaseId: string,
  designId: string,
): Promise<Database> {
  // Get the database config
  const config = getDatabase(databaseId);

  // Remove the design from the database's designs
  const designs = config.designs.filter((design) => design.id !== designId);

  // Update the database
  return updateDatabase(databaseId, { designs });
}
