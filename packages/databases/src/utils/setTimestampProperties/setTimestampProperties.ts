import { PropertiesSchema, PropertyMap } from '@minddrop/properties';

// The timestamp meta property types which store a Date value
type TimestampPropertyType = 'created' | 'last-modified';

/**
 * Sets the given date as the value of an entry's timestamp meta properties.
 * Only properties whose type is listed in `types` and which are defined in the
 * schema are set, so databases without timestamp properties are left untouched.
 *
 * @param schema - The database's properties schema.
 * @param properties - The entry's property values.
 * @param types - The timestamp property types to set.
 * @param date - The date to set as the property value.
 *
 * @returns A new properties map with the timestamp values set.
 */
export function setTimestampProperties<
  TProperties extends PropertyMap = PropertyMap,
>(
  schema: PropertiesSchema,
  properties: TProperties,
  types: TimestampPropertyType[],
  date: Date,
): TProperties {
  // Clone the properties to avoid mutating the original
  const updatedProperties: PropertyMap = { ...properties };

  types.forEach((type) => {
    // Find the schema property matching the timestamp type
    const property = schema.find((property) => property.type === type);

    // Skip if the database has no property of this type
    if (!property) {
      return;
    }

    // Set the property value to the provided date
    updatedProperties[property.name] = date;
  });

  return updatedProperties as TProperties;
}
