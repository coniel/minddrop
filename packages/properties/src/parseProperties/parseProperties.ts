import { YAML, isSerializedDate } from '@minddrop/utils';
import { PropertyMap } from '../types';

/**
 * Parses a properties string according to the provided schema.
 *
 * @param string - The properties string.
 * @param schema - The properties schema.
 *
 * @returns The parsed properties.
 */
export function parseProperties<TProperties extends PropertyMap = PropertyMap>(
  string: string,
): TProperties {
  // Parse the properties string
  const parsed = YAML.parse(string);

  // Parse dates string into Date objects
  Object.entries(parsed).forEach(([key, value]) => {
    if (isSerializedDate(value)) {
      parsed[key] = new Date(parsed[key] as string);
    }
  });

  return parsed as TProperties;
}
