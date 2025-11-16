import { isSerializedDate } from '@minddrop/utils';
import { PropertiesSchema, PropertyMap } from '../types';

/**
 * Parses stringified properties from JSON.
 *
 * @param schema - The properties schema.
 * @param string - The properties string.
 *
 * @returns The parsed properties.
 */
export function parsePropertiesFromJson<
  TProperties extends PropertyMap = PropertyMap,
>(schema: PropertiesSchema, string: string): TProperties {
  // Parse the properties string
  const parsed = JSON.parse(string);

  // Parse dates string into Date objects
  Object.entries(parsed).forEach(([key, value]) => {
    if (isSerializedDate(value)) {
      parsed[key] = new Date(parsed[key] as string);
    }
  });

  return parsed as TProperties;
}
