import { PropertySchema, PropertyType } from '@minddrop/properties';
import { getDatabase } from '../../getDatabase';

/**
 * Resolves the default property of a given type in a database.
 *
 * Property match priority:
 * - The database's default property for the type
 * - The first property of the type
 *
 * @param databaseId - The ID of the database.
 * @param propertyType - The property type.
 * @returns The default property, or null when the database has none of
 * the type.
 *
 * @throws {DatabaseNotFoundError} If the database does not exist.
 */
export function resolveDefaultPropertyOfType(
  databaseId: string,
  propertyType: PropertyType,
): PropertySchema | null {
  // Get the database
  const database = getDatabase(databaseId);
  // Get the name of the database's default property for the type
  const defaultPropertyName = database.defaultProperties?.[propertyType];

  // Find the default property, when it exists and is of the type
  const defaultProperty = database.properties.find(
    (property) =>
      property.name === defaultPropertyName && property.type === propertyType,
  );

  // Use the default property if found
  if (defaultProperty) {
    return defaultProperty;
  }

  // Fall back to the first property of the type
  return (
    database.properties.find((property) => property.type === propertyType) ??
    null
  );
}
