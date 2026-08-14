import { YAML } from '@minddrop/utils';
import { PropertiesSchema, PropertyMap } from '../types';

/**
 * Stringifies the given properties to YAML according to the provided schema.
 *
 * Properties are written in the order the schema declares them, which is what
 * the database's property sorting controls. Any property absent from the schema
 * follows them.
 *
 * @param schema - The properties schema.
 * @param properties - The properties to stringify.
 * @returns The stringified properties.
 */
export function stringifyPropertiesToYaml(
  schema: PropertiesSchema,
  properties: PropertyMap,
): string {
  const ordered: PropertyMap = {};

  // Schema properties first, in the order the schema declares them
  schema.forEach((property) => {
    if (property.name in properties) {
      ordered[property.name] = properties[property.name];
    }
  });

  // Followed by any property the schema does not declare
  Object.entries(properties).forEach(([name, value]) => {
    if (!(name in ordered)) {
      ordered[name] = value;
    }
  });

  // Stringify properties
  return YAML.stringify(ordered);
}
