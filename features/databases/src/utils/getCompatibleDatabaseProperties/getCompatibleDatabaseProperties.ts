import { withImplicitTitleProperty } from '@minddrop/databases';
import {
  PropertiesSchema,
  PropertySchema,
  PropertyType,
} from '@minddrop/properties';

// Database property types whose values a design property of a
// given type can render
const compatiblePropertyTypesMap: Record<PropertyType, PropertyType[]> = {
  collection: ['collection'],
  created: ['created'],
  date: ['date', 'created', 'last-modified'],
  file: ['file'],
  'formatted-text': ['formatted-text'],
  icon: ['icon'],
  image: ['image'],
  'last-modified': ['last-modified'],
  number: ['number'],
  select: ['select'],
  text: ['text', 'title', 'select'],
  title: ['title', 'text'],
  toggle: ['toggle'],
  url: ['url'],
};

/**
 * Returns the database properties that a design property of the
 * given schema can be mapped to, including the implicit entry
 * Title property.
 */
export function getCompatibleDatabaseProperties(
  designProperty: PropertySchema,
  databaseProperties: PropertiesSchema,
): PropertiesSchema {
  const compatibleTypes = compatiblePropertyTypesMap[designProperty.type] || [];

  // Add the implicit Title property unless the database schema
  // already declares a title property
  const properties = withImplicitTitleProperty(databaseProperties);

  return properties.filter((property) =>
    compatibleTypes.includes(property.type),
  );
}
