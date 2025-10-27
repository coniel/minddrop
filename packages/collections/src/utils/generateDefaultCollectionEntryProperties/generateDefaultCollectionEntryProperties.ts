import {
  BaseCollectionTypeConfig,
  Collection,
  CollectionEntryCustomProperties,
} from '../../types';

/**
 * Generates default properties for a collection entry based on the
 * collection's properties.
 *
 * @param collection - The parent collection of the entry to generate the default properties for.
 * @returns The default properties for the collection entry.
 */
export function generateDefaultCollectionEntryProperties(
  collectionTypeConfig: BaseCollectionTypeConfig,
  collection: Collection,
): CollectionEntryCustomProperties {
  const properties = [
    ...(collectionTypeConfig.coreProperties || []),
    ...collection.properties,
  ];

  return properties.reduce((properties, property) => {
    if (typeof property.defaultValue !== 'undefined') {
      // If the property is a date, format the default value
      if (property.type === 'date') {
        const format = Intl.DateTimeFormat(property.locale, property.format);

        properties[property.name] = format.format(
          property.defaultValue === 'now' ? new Date() : property.defaultValue,
        );
      } else {
        properties[property.name] = property.defaultValue;
      }
    }

    return properties;
  }, {} as CollectionEntryCustomProperties);
}
