import { ContentType, Database } from '../../types';
import { resolveContentTypePropertyTypes } from '../resolveContentTypePropertyTypes';

/**
 * Filters databases to those with a property which can hold
 * content of a given type.
 *
 * @param databases - The databases to filter.
 * @param contentType - The content type.
 * @returns The databases accepting the content type.
 */
export function filterDatabasesByContentType(
  databases: Database[],
  contentType: ContentType,
): Database[] {
  // Resolve the property types accepting the content type
  const propertyTypes = resolveContentTypePropertyTypes(contentType);

  // Return the databases with a property of one of the types
  return databases.filter((database) =>
    database.properties.some((property) =>
      propertyTypes.includes(property.type),
    ),
  );
}
