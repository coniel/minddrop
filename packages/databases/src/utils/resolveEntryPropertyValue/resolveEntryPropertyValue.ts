import { PropertyType, PropertyValue } from '@minddrop/properties';
import { DatabaseEntry } from '../../types';
import { resolveEntryMetadataValue } from '../resolveEntryMetadataValue';

/**
 * Resolves the value an entry holds for a property. Metadata
 * backed types resolve regardless of the name.
 *
 * @param entry - The database entry.
 * @param name - The property name.
 * @param type - The property type.
 * @returns The property value, or undefined when the entry has none.
 */
export function resolveEntryPropertyValue(
  entry: DatabaseEntry,
  name: string,
  type: PropertyType,
): PropertyValue | undefined {
  const metadataValue = resolveEntryMetadataValue(entry, type);

  // Only types not backed by metadata resolve to undefined
  if (metadataValue !== undefined) {
    return metadataValue;
  }

  return entry.properties[name];
}
