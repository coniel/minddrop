import { PropertyType, PropertyValue } from '@minddrop/properties';
import { Entry } from '../../types';

/**
 * Resolves the value an entry holds for a metadata backed
 * property type.
 *
 * @param entry - The database entry.
 * @param type - The metadata property type.
 * @returns The metadata value, or undefined for types not backed by metadata.
 */
export function resolveEntryMetadataValue(
  entry: Entry,
  type: PropertyType,
): PropertyValue | undefined {
  if (type === 'title') {
    return entry.title;
  }

  if (type === 'created') {
    return entry.created;
  }

  if (type === 'last-modified') {
    return entry.lastModified;
  }

  if (type === 'color') {
    return entry.metadata.color ?? null;
  }

  return undefined;
}
