import { YAML, isSerializedDate } from '@minddrop/utils';
import { PropertiesSchema, PropertyMap } from '../types';

/**
 * Parses stringified properties from YAML.
 *
 * @param _schema - The properties schema, unused by the YAML parser.
 * @param string - The properties string.
 *
 * @returns The parsed properties.
 */
export function parsePropertiesFromYaml<
  TProperties extends PropertyMap = PropertyMap,
>(_schema: PropertiesSchema, string: string): TProperties {
  // Parse the properties string
  const parsed = YAML.parse(string);

  // Empty or comment only YAML parses to null
  if (!parsed) {
    return {} as TProperties;
  }

  // Parse dates string into Date objects
  Object.entries(parsed).forEach(([key, value]) => {
    if (isSerializedDate(value)) {
      parsed[key] = new Date(parsed[key] as string);
    }
  });

  return parsed as TProperties;
}
