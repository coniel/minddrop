import { Design } from '@minddrop/designs';
import { InvalidParameterError } from '@minddrop/utils';
import { getDatabase } from '../getDatabase';
import { Database } from '../types';
import { updateDatabase } from '../updateDatabase/updateDatabase';

/**
 * Updates a design in a database.
 *
 * @param id - The ID of the database to update the design in.
 * @param updatedDesign - The updated design.
 * @returns The updated database config.
 */
export async function updateDatabaseDesign(
  id: string,
  updatedDesign: Design,
): Promise<Database> {
  // Get the database config
  const config = getDatabase(id);
  // Find the existing design
  const design = config.designs.find(
    (design) => design.id === updatedDesign.id,
  );

  // Ensure design exists
  if (!design) {
    throw new InvalidParameterError(
      `Design with ID ${updatedDesign.id} not found.`,
    );
  }

  // Update the design in the database's designs
  const designs = config.designs.map((design) =>
    design.id === updatedDesign.id ? updatedDesign : design,
  );

  // Update the database
  return updateDatabase(id, { designs });
}
