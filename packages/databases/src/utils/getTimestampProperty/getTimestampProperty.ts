import { PropertiesSchema, PropertyMap } from '@minddrop/properties';

// The timestamp meta property types which store a Date value
type TimestampPropertyType = 'created' | 'last-modified';

/**
 * Looks up the value of an entry's timestamp meta property.
 *
 * @param type - The timestamp property type to look up.
 * @param schema - The database's properties schema.
 * @param properties - The entry's property values.
 *
 * @returns The property's date value, or null if the database has no
 * property of the given type or the entry has no value for it.
 */
export function getTimestampProperty(
  type: TimestampPropertyType,
  schema: PropertiesSchema,
  properties: PropertyMap,
): Date | null {
  // Find a property in the schema with the matching type
  const property = schema.find((property) => property.type === type);

  if (!property) {
    return null;
  }

  // Get the entry's value for the property
  const value = properties[property.name];

  if (value instanceof Date) {
    return value;
  }

  // Values deserialized from the entry file may still be strings
  if (typeof value === 'string') {
    const parsed = new Date(value);

    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  return null;
}
