import { withImplicitMetadataProperties } from '@minddrop/databases';
import {
  PropertiesSchema,
  PropertySchema,
  PropertyType,
} from '@minddrop/properties';

// Database property types whose values a design property of a
// given type can render
const compatiblePropertyTypesMap: Record<PropertyType, PropertyType[]> = {
  collection: ['collection'],
  color: ['color'],
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
 * metadata properties.
 */
export function getCompatibleDatabaseProperties(
  designProperty: PropertySchema,
  databaseProperties: PropertiesSchema,
): PropertiesSchema {
  const compatibleTypes = compatiblePropertyTypesMap[designProperty.type] || [];

  // Add the metadata properties the database schema does not
  // declare itself
  const properties = withImplicitMetadataProperties(databaseProperties);

  return properties.filter((property) =>
    compatibleTypes.includes(property.type),
  );
}
