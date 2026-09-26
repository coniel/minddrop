import { Properties, UrlPropertySchema } from '@minddrop/properties';
import { resolveDefaultPropertyOfType } from '../resolveDefaultPropertyOfType';

// TODO: Implement URL property filtering logic once URL properties support constraints

/**
 * Returns the default property for the specified database which supports
 * the specified URL.
 *
 * @param databaseId - The ID of the database.
 * @param _url - The URL. Unused until the filtering logic is implemented.
 * @returns The default URL property, or null if the database has none.
 *
 * @throws {DatabaseNotFoundError} If the database does not exist.
 */
export function getDefaultUrlProperty(
  databaseId: string,
  _url: string,
): UrlPropertySchema | null {
  // Resolve the database's default URL property
  const property = resolveDefaultPropertyOfType(
    databaseId,
    Properties.schemas.url.type,
  );

  // Ensure the property is a url property
  if (!property || !Properties.isUrl(property)) {
    return null;
  }

  return property;
}
