import { getDatabase } from '../getDatabase';
import { Database } from '../types';
import { updateDatabase } from '../updateDatabase';

/**
 * Removes a property from a database.
 *
 * @param name - The name of the database to remove the property from.
 * @param propertyName - The name of the property to remove.
 * @returns The updated database config.
 */
export async function removeDatabaseProperty(
  name: string,
  propertyName: string,
): Promise<Database> {
  // Get the database config
  const config = getDatabase(name);

  // Remove the property from the database's properties
  const properties = config.properties.filter(
    (property) => property.name !== propertyName,
  );

  // Update the database
  updateDatabase(name, { properties });

  // Return the updated config
  return {
    ...config,
    properties,
  };
}
