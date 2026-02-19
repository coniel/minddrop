import { Properties, UrlPropertySchema } from '@minddrop/properties';
import { getDatabase } from '../../getDatabase';

// TODO: Implement URL property filtering logic once URL properties support constraints

/**
 * Returns the default property for the specified database which supports
 * the specified URL.
 *
 * Property match priority:
 * - Specific default property for the URL type
 * - First available specific property which supports the URL type
 *
 * @param databaseId - The ID of the database.
 * @param url - The URL.
 * @returns The default property for the specified database and URL or null if no matching property exists.
 */
export function getDefaultUrlProperty(
  databaseId: string,
  url: string,
): UrlPropertySchema | null {
  // Get the database
  const database = getDatabase(databaseId);
  // Check if a default url property is provided
  let propertyName = database.defaultProperties?.[UrlPropertySchema.type];

  // Get the default url property if there is one
  let property = propertyName
    ? database.properties.find((property) => property.name === propertyName)
    : undefined;

  // If there is no default url property, use the first available url property
  if (!property) {
    property = database.properties.find((property) =>
      Properties.isUrl(property),
    );
  }

  // Ensure the property is a url property
  if (!property || !Properties.isUrl(property)) {
    return null;
  }

  return property;
}
