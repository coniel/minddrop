import { PropertiesSchema, PropertyMap } from '@minddrop/properties';
import { DatabaseEntry } from '../../types';
import { resolveEntryMetadataPropertyValues } from '../resolveEntryMetadataPropertyValues';

/**
 * Returns an entry's property values keyed by property name,
 * backed by its metadata values so that title, timestamp and
 * colour properties resolve alongside the entry's own properties.
 *
 * @param entry - The database entry.
 * @param properties - The database properties schema.
 * @returns A map of property names to values.
 */
export function entryPropertyValues(
  entry: DatabaseEntry,
  properties: PropertiesSchema,
): PropertyMap {
  return {
    ...resolveEntryMetadataPropertyValues(entry, properties),
    ...entry.properties,
  };
}
