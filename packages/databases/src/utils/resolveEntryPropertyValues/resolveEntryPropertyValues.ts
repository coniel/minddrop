import {
  Properties,
  PropertiesSchema,
  PropertyMap,
  PropertyValue,
} from '@minddrop/properties';
import { Entry } from '../../types';
import { resolveEntryMetadataPropertyValues } from '../resolveEntryMetadataPropertyValues';
import { resolveEntryPropertyFilePath } from '../resolveEntryPropertyFilePath';
import { virtualCollectionId } from '../virtualCollectionId';

/**
 * Resolves an entry's property values keyed by property name,
 * backed by its metadata values so that title, timestamp and
 * colour properties resolve alongside the entry's own properties.
 * An embeddable file property's value is the file's path rather
 * than its stored name. A collection property's value is the ID
 * of its virtual collection rather than its stored entry IDs.
 *
 * @param entry - The database entry.
 * @param properties - The database properties schema.
 * @returns A map of property names to values.
 */
export function resolveEntryPropertyValues(
  entry: Entry,
  properties: PropertiesSchema,
): PropertyMap {
  const values: Record<string, PropertyValue> = {
    ...resolveEntryMetadataPropertyValues(entry, properties),
    ...entry.properties,
  };

  // Replace the stored values of file and collection properties
  for (const property of properties) {
    const value = values[property.name];

    // Replace an embeddable file's name with the file's path
    if (Properties.isEmbeddableFile(property) && typeof value === 'string') {
      values[property.name] = resolveEntryPropertyFilePath(
        entry.id,
        property.name,
        value,
      );
    }

    // Replace a collection's entry IDs with its virtual collection's ID
    if (property.type === 'collection') {
      values[property.name] = virtualCollectionId(entry.id, property.name);
    }
  }

  return values;
}
