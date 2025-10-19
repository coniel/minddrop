import { YAML } from '@minddrop/utils';
import { PropertiesSchema, PropertyMap } from '../types';

/**
 * Stringifies the given properties according to the provided schema,
 * ensuring that default values are included for any missing properties.
 *
 * @param properties - The properties to stringify.
 * @param schema - The schema defining the properties.
 * @returns The stringified properties.
 */
export function stringifyProperties(
  properties: PropertyMap,
  schema: PropertiesSchema,
): string {
  // Add default values for missing properties
  const completeProperties = { ...properties } as any;

  schema.forEach((propertySchema) => {
    const { name, defaultValue } = propertySchema;

    if (
      defaultValue !== undefined &&
      (completeProperties[name] === undefined ||
        completeProperties[name] === null)
    ) {
      completeProperties[name] = defaultValue;
    }
  });

  // Stringify properties
  return YAML.stringify(completeProperties);
}
