import { Fs } from '@minddrop/file-system';
import { InvalidCollectionTypeError } from '../errors';
import { getCollection } from '../getCollection';
import { getCollectionTypeConfig } from '../getCollectionTypeConfig';
import { CollectionEntry, TextCollectionTypeConfig } from '../types';
import { writeCollectionEntryProperties } from '../writeCollectionEntryProperties';

/**
 * Writes a text based collection entry to the file system.
 *
 * @property entry - The collection entry to write.
 *
 * @throws {CollectionNotFoundError} If the collection does not exist.
 * @throws {CollectionTypeNotRegisteredError} If the collection type is not registered.
 */
export async function writeTextCollectionEntry(
  entry: CollectionEntry,
): Promise<void> {
  const { collectionPath, properties } = entry;
  // Get the collection
  const collection = getCollection(collectionPath, true);
  // Get the collection type config
  const config = getCollectionTypeConfig(
    collection.type,
  ) as TextCollectionTypeConfig;
  // The entry title
  let title = properties.title;

  // Ensure that the collection is a text collection
  if (config.type !== 'text') {
    throw new InvalidCollectionTypeError(collection.path, 'text', config.type);
  }

  // Serialize the entry into the appropriate text format for the collection type
  // and extract any properties that need to be stored in a separate properties file.
  const serialized = config.serialize(properties);
  const text = typeof serialized === 'string' ? serialized : serialized[0];
  const serializedProperties =
    typeof serialized === 'string' ? {} : serialized[1];

  // Write the main entry file to the file system
  Fs.writeTextFile(entry.path, text);

  // If additional properties were returned during serialization, write them
  // write them to a properties file.
  if (Object.keys(serializedProperties).length > 0) {
    writeCollectionEntryProperties(collectionPath, title, serializedProperties);
  }
}
