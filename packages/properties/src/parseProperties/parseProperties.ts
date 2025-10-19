import { YAML } from '@minddrop/utils';
import { Properties, PropertySchema } from '../types';

/**
 * Parses a properties string according to the provided schema.
 *
 * @param string - The properties string.
 * @param schema - The properties schema.
 *
 * @returns The parsed properties.
 */
export function parseProperties<TProperties extends Properties = Properties>(
  string: string,
  schema: PropertySchema[],
): TProperties {
  // Parse the properties string
  const parsed = YAML.parse(string);

  // Parse dates according to the schema
  schema.forEach((propertySchema) => {
    if (propertySchema.type === 'date' && parsed[propertySchema.name]) {
      parsed[propertySchema.name] = new Date(parsed[propertySchema.name]);
    }
  });

  // Add the default values for missing properties
  schema.forEach((propertySchema) => {
    if (
      parsed[propertySchema.name] === undefined &&
      propertySchema.defaultValue !== undefined
    ) {
      parsed[propertySchema.name] = propertySchema.defaultValue;
    }
  });

  return parsed as TProperties;
}
