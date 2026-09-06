import { PropertiesSchema, PropertyMap } from '../types';

/**
 * Stringifies the given properties to JSON.
 *
 * @param _schema - The properties schema, unused by the JSON format.
 * @param properties - The properties to stringify.
 * @returns The stringified properties.
 */
export function stringifyPropertiesToJson(
  _schema: PropertiesSchema,
  properties: PropertyMap,
): string {
  // Stringify properties
  return JSON.stringify(properties);
}
