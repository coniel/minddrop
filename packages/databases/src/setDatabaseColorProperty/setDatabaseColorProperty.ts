import { InvalidParameterError } from '@minddrop/utils';
import { getDatabase } from '../getDatabase';
import { Database } from '../types';
import { updateDatabase } from '../updateDatabase';

/**
 * Sets the select property a database's entries are colored by,
 * or clears it to color entries by the meta Color property.
 *
 * @param databaseId - The ID of the database.
 * @param propertyName - The name of the select property, or null for the meta Color property.
 * @returns The updated database.
 *
 * @dispatches databases:database:updated
 *
 * @throws {DatabaseNotFoundError} If the database does not exist.
 * @throws {InvalidParameterError} If the property does not exist or is not a select property.
 */
export async function setDatabaseColorProperty(
  databaseId: string,
  propertyName: string | null,
): Promise<Database> {
  // Get the database
  const database = getDatabase(databaseId);

  // No-op if the color property is unchanged
  if ((database.colorProperty ?? null) === propertyName) {
    return database;
  }

  // Named properties must exist on the database and be selects
  if (propertyName !== null) {
    const property = database.properties.find(
      (candidate) => candidate.name === propertyName,
    );

    if (!property || property.type !== 'select') {
      throw new InvalidParameterError(
        `Database ${databaseId} does not have a select property named ${propertyName}.`,
      );
    }
  }

  // Update the database
  return updateDatabase(databaseId, { colorProperty: propertyName });
}
