import { Design } from '@minddrop/designs';
import { getDatabase } from '../getDatabase';
import { Database } from '../types';
import { updateDatabase } from '../updateDatabase';

/**
 * Adds a design to a database.
 *
 * @param id - The ID of the database to add the design to.
 * @param design - The design to add.
 * @returns The updated database config.
 */
export async function addDatabaseDesign(
  id: string,
  design: Design,
): Promise<Database> {
  // Get the database config
  const config = getDatabase(id);

  // Add the design to the database's designs
  const designs = [...config.designs, design];

  // Update the database
  const updatedConfig = await updateDatabase(id, { designs });

  // Return the updated config
  return updatedConfig;
}
