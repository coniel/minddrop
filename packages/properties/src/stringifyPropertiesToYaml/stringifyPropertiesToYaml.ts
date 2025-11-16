import { YAML } from '@minddrop/utils';
import { PropertiesSchema, PropertyMap } from '../types';

/**
 * Stringifies the given properties to YAML according to the provided schema.
 *
 * @param schema - The properties schema.
 * @param properties - The properties to stringify.
 * @returns The stringified properties.
 */
export function stringifyPropertiesToYaml(
  schema: PropertiesSchema,
  properties: PropertyMap,
): string {
  // Stringify properties
  return YAML.stringify(properties);
}
