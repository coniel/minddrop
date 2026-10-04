import {
  Properties,
  PropertiesSchema,
  PropertyMap,
  PropertyValue,
} from '@minddrop/properties';
import { Entry } from '../../types';
import { resolveEntryMetadataPropertyValues } from '../resolveEntryMetadataPropertyValues';
import { resolveEntryPropertyFilePath } from '../resolveEntryPropertyFilePath';

/**
 * Returns an entry's property values keyed by property name,
 * backed by its metadata values so that title, timestamp and
 * colour properties resolve alongside the entry's own properties.
 * An embeddable file property's value is the file's path rather
 * than its stored name.
 *
 * @param entry - The database entry.
 * @param properties - The database properties schema.
 * @returns A map of property names to values.
 */
export function entryPropertyValues(
  entry: Entry,
  properties: PropertiesSchema,
): PropertyMap {
  const values: Record<string, PropertyValue> = {
    ...resolveEntryMetadataPropertyValues(entry, properties),
    ...entry.properties,
  };

  // Replace embeddable file names with the files' paths
  for (const property of properties) {
    const value = values[property.name];

    if (Properties.isEmbeddableFile(property) && typeof value === 'string') {
      values[property.name] = resolveEntryPropertyFilePath(
        entry.id,
        property.name,
        value,
      );
    }
  }

  return values;
}
