import { createTextCollectionEntry } from '../createTextCollectionEntry';
import { getAllCollections } from '../getAllCollections';
import { getCollectionTypeConfig } from '../getCollectionTypeConfig';
import {
  Collection,
  CollectionEntry,
  CollectionEntryProperties,
  TextCollectionTypeConfig,
} from '../types';

/**
 * Creates a collection entry from the provided string.
 *
 * The function checks all text-based collections to find one that
 * can accept the provided string based on their type config's
 * `match` function. If a matching collection is found, a collection
 * entry is created using the properties returned by the `match`
 * function.
 *
 * @param string - The string to create the collection entry from.
 * @returns A promise that resolves to the created collection entry,
 * or null if no matching collection was found.
 */
export async function createCollectionEntryFromString(
  string: string,
): Promise<CollectionEntry | null> {
  // Get all text based collections
  const collections = getAllCollections().filter((collection) => {
    const config = getCollectionTypeConfig(collection.type);

    return config && config.type === 'text';
  });

  // Loop through the text collections and find one that accepts
  // the provided string.
  let matchCollection: Collection | null = null;
  let matchProperties: Partial<CollectionEntryProperties> | null = null;

  for (const collection of collections) {
    const config = getCollectionTypeConfig<TextCollectionTypeConfig>(
      collection.type,
    );

    if (config?.match) {
      matchProperties = config.match(string);

      if (matchProperties) {
        // A matching collection was found, stop searching
        matchCollection = collection;
        break;
      }
    }
  }

  // If a matching collection was found, create a collection entry
  if (matchProperties && matchCollection) {
    return createTextCollectionEntry(matchCollection.path, matchProperties);
  }

  // No matching collection was found
  return null;
}
