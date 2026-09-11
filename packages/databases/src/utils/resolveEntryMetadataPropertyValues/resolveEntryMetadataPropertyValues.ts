import { PropertiesSchema, PropertyValue } from '@minddrop/properties';
import { DatabaseEntry } from '../../types';
import { resolveEntryMetadataValue } from '../resolveEntryMetadataValue';
import { withImplicitMetadataProperties } from '../withImplicitMetadataProperties';

/**
 * Returns an entry's metadata values. Values are keyed by their
 * user defined property names if defined, falling back to
 * implicit metadata names.
 *
 * @param entry - The database entry.
 * @param properties - The database properties schema.
 * @returns A map of property names to metadata values.
 */
export function resolveEntryMetadataPropertyValues(
  entry: DatabaseEntry,
  properties: PropertiesSchema,
): Record<string, PropertyValue> {
  const values: Record<string, PropertyValue> = {};

  for (const property of withImplicitMetadataProperties(properties)) {
    const value = resolveEntryMetadataValue(entry, property.type);

    // Properties not backed by metadata have no value here
    if (value !== undefined) {
      values[property.name] = value;
    }
  }

  return values;
}
