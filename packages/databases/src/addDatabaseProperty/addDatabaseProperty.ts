import { PropertySchema } from '@minddrop/properties';
import { getDatabase } from '../getDatabase';
import { Database } from '../types';
import { updateDatabase } from '../updateDatabase';

/**
 * Adds a property to a database.
 *
 * @param type - The database to add the property to.
 * @param property - The property to add.
 * @returns The updated database config.
 */
export async function addDatabaseProperty(
  type: string,
  property: PropertySchema,
): Promise<Database> {
  // Get the database config
  const config = getDatabase(type);

  // Add the property to the database's properties
  const properties = [...config.properties, property];

  // Update the database
  const updatedConfig = await updateDatabase(type, { properties });

  // Return the updated config
  return updatedConfig;
}
