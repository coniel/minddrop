import { PropertyValue } from '@minddrop/properties';
import { InvalidParameterError } from '@minddrop/utils';
import { getDatabase } from '../getDatabase';
import { getDatabaseEntry } from '../getDatabaseEntry';
import { DatabaseEntry } from '../types';
import { updateDatabaseEntry } from '../updateDatabaseEntry';

/**
 * Updates a property on a database entry.
 *
 * @param entryId - The ID of the entry to update.
 * @param propertyName - The name of the property to update.
 * @param value - The new value of the property.
 *
 * @returns The updated entry.
 *
 * @throws {InvalidParameterError} If the database does not have a property with the specified name.
 */
export async function updateDatabaseEntryProperty(
  entryId: string,
  propertyName: string,
  value: PropertyValue,
): Promise<DatabaseEntry> {
  // Get the entry
  const entry = getDatabaseEntry(entryId);
  // Get the database
  const database = getDatabase(entry.database);

  // Ensure the property exists on the database
  if (!database.properties.find((property) => property.name === propertyName)) {
    throw new InvalidParameterError(
      `Database ${database.id} does not have a property named ${propertyName}.`,
    );
  }

  // Update the entry
  return updateDatabaseEntry(entry.id, {
    properties: {
      [propertyName]: value,
    },
  });
}
