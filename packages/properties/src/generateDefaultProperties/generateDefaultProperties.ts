import { PropertiesSchema, PropertyMap } from '../types';

/**
 * Generates a map of default property values based on the provided schema.
 *
 * @param schema - The properties schema.
 * @param prperties - Existing properties to include into the result.
 *
 * @returns A map of default property values.
 */
export function generateDefaultProperties<
  TProperties extends PropertyMap = PropertyMap,
>(schema: PropertiesSchema, prperties: Partial<TProperties> = {}): TProperties {
  const defaultProperties: PropertyMap = {};

  schema.forEach((propertySchema) => {
    if (propertySchema.defaultValue !== undefined) {
      // Date properties can have a default value of 'now'
      // which initializes the property with the current date.
      if (
        propertySchema.defaultValue === 'now' &&
        propertySchema.type === 'date'
      ) {
        defaultProperties[propertySchema.name] = new Date();
      } else {
        defaultProperties[propertySchema.name] = propertySchema.defaultValue;
      }
    }
  });

  return { ...defaultProperties, ...prperties } as TProperties;
}
