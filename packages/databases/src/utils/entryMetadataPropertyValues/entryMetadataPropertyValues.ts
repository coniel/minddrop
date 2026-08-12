import { PropertiesSchema, PropertyValue } from '@minddrop/properties';
import { DatabaseEntry } from '../../types';
import { withImplicitMetadataProperties } from '../withImplicitMetadataProperties';

/**
 * Returns an entry's metadata values keyed by the name of the
 * property they are surfaced as, using the implicit metadata
 * property names where the schema does not declare its own.
 *
 * @param entry - The database entry.
 * @param properties - The database properties schema.
 * @returns A map of property names to metadata values.
 */
export function entryMetadataPropertyValues(
  entry: DatabaseEntry,
  properties: PropertiesSchema,
): Record<string, PropertyValue> {
  const values: Record<string, PropertyValue> = {};

  for (const property of withImplicitMetadataProperties(properties)) {
    // The entry title, which is derived from its file name
    if (property.type === 'title') {
      values[property.name] = entry.title;
    }

    // The entry creation timestamp
    if (property.type === 'created') {
      values[property.name] = entry.created;
    }

    // The entry modification timestamp
    if (property.type === 'last-modified') {
      values[property.name] = entry.lastModified;
    }
  }

  return values;
}
