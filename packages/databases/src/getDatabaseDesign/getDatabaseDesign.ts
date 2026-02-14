import { Design } from '@minddrop/designs';
import { getDatabase } from '../getDatabase/getDatabase';

/**
 * Returns the design with the specified ID from the database with the specified ID,
 * or null if the design does not exist.
 *
 * @param databaseId - The ID of the database.
 * @param designId - The ID of the design.
 * @returns The design with the specified ID, or null if the design does not exist.
 */
export function getDatabaseDesign(
  databaseId: string,
  designId: string,
): Design | null {
  // Get the database
  const database = getDatabase(databaseId);

  // Get the specified design
  const design = database.designs.find((design) => design.id === designId);

  return design || null;
}
