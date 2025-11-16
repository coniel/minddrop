import { PropertiesSchema, PropertyMap } from '../types';

/**
 * Stringifies the given properties to JSON according to the provided schema.
 *
 & @param schema - The properties schema.
 * @param properties - The properties to stringify.
 * @returns The stringified properties.
 */
export function stringifyPropertiesToJson(
  schema: PropertiesSchema,
  properties: PropertyMap,
): string {
  // Stringify properties
  return JSON.stringify(properties);
}
