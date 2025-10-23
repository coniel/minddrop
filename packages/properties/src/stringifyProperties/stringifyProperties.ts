import { YAML } from '@minddrop/utils';
import { PropertyMap } from '../types';

/**
 * Stringifies the given properties according to the provided schema,
 * ensuring that default values are included for any missing properties.
 *
 * @param properties - The properties to stringify.
 * @param schema - The schema defining the properties.
 * @returns The stringified properties.
 */
export function stringifyProperties(properties: PropertyMap): string {
  // Stringify properties
  return YAML.stringify(properties);
}
