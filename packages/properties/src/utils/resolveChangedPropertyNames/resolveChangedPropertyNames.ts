import { TIMESTAMP_PROPERTY_TYPES } from '../../constants';
import { PropertiesSchema, PropertyMap } from '../../types';
import { isEqualPropertyValue } from '../isEqualPropertyValue';
import { resolvePropertyNamesOfType } from '../resolvePropertyNamesOfType';

/**
 * Returns the names of the properties whose values differ between
 * two property maps. A property present in only one map counts as
 * changed, unless its value is null. Timestamp properties are left
 * out.
 *
 * @param schema - The properties schema.
 * @param original - The original property values.
 * @param updated - The updated property values.
 * @returns The names of the changed properties.
 */
export function resolveChangedPropertyNames(
  schema: PropertiesSchema,
  original: PropertyMap,
  updated: PropertyMap,
): string[] {
  // Get the names of the schema's timestamp properties
  const timestampNames = new Set(
    resolvePropertyNamesOfType(schema, TIMESTAMP_PROPERTY_TYPES),
  );

  // Get the names present in either map
  const names = new Set([...Object.keys(original), ...Object.keys(updated)]);

  // Filter for the non-timestamp properties given a different value
  return [...names].filter(
    (name) =>
      !timestampNames.has(name) &&
      !isEqualPropertyValue(original[name] ?? null, updated[name] ?? null),
  );
}
