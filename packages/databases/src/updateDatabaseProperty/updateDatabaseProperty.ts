import { PropertySchema } from '@minddrop/properties';
import { InvalidParameterError } from '@minddrop/utils';
import { getDatabase } from '../getDatabase';
import { Database } from '../types';
import { updateDatabase } from '../updateDatabase/updateDatabase';

/**
 * Updates a property in a database.
 *
 * @param name - The name of the database to update the property in.
 * @param updatedProperty - The updated property schema.
 * @returns The updated database config.
 */
export async function updateDatabaseProperty(
  name: string,
  updatedProperty: PropertySchema,
): Promise<Database> {
  // Get the database config
  const config = getDatabase(name);
  // Find the existing property
  const property = config.properties.find(
    (prop) => prop.name === updatedProperty.name,
  );

  // Prevent property name from being changed
  if (!property) {
    throw new InvalidParameterError(
      'Cannot update property name. Use "renameProperty" method instead.',
    );
  }

  // Prevent changing property type
  if (property.type !== updatedProperty.type) {
    throw new InvalidParameterError(
      'Cannot update property type. Use the "changePropertyType" method instead.',
    );
  }

  // Update the property in the database's properties
  const properties = config.properties.map((prop) =>
    prop.name === updatedProperty.name ? updatedProperty : prop,
  );

  // Update the database
  return updateDatabase(name, { properties });
}
