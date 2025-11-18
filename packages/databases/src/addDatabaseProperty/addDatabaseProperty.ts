import { PropertySchema } from '@minddrop/properties';
import { getDatabase } from '../getDatabase';
import { Database } from '../types';
import { updateDatabase } from '../updateDatabase';

/**
 * Adds a property to a database.
 *
 * @param id - The ID of the database to add the property to.
 * @param property - The property to add.
 * @returns The updated database config.
 */
export async function addDatabaseProperty(
  id: string,
  property: PropertySchema,
): Promise<Database> {
  // Get the database config
  const config = getDatabase(id);

  // Add the property to the database's properties
  const properties = [...config.properties, property];

  // Update the database
  const updatedConfig = await updateDatabase(id, { properties });

  // Return the updated config
  return updatedConfig;
}
