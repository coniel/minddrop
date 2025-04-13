import { Events } from '@minddrop/events';
import { InvalidParameterError, isValidUrl } from '@minddrop/utils';
import { CollectionEntriesStore } from '../CollectionEntriesStore';
import { getCollection } from '../getCollection';
import { getCollectionTypeConfig } from '../getCollectionTypeConfig';
import { CollectionEntry } from '../types';
import { generateDefaultCollectionEntryProperties } from '../utils';

/**
 * Create a new entry in the collection.
 *
 * @param path - The path to the collection directory.
 * @param data - The data used to create the entry.
 * @returns The created entry.
 *
 * @dispatches collections:entries:create
 *
 * @throws {CollectionNotFoundError} If the collection does not exist.
 * @throws {CollectionTypeNotRegisteredError} If the collection type is not registered.
 * @throws {InvalidParameterError} If the collection type requires a file or URL but invalid data is provided.
 */
export async function createCollectionEntry<
  TEntry extends CollectionEntry = CollectionEntry,
>(path: string, data?: File | string): Promise<TEntry> {
  // Get the collection
  const collection = getCollection(path, true);

  // Get the collection type config
  const config = getCollectionTypeConfig(collection.type);

  // Ensure that the data is a file if the collection type requires it
  if (config.requiredDataType === 'file' && !(data instanceof File)) {
    throw new InvalidParameterError('Invalid data type. Expected a file.');
  }

  // Ensure that the data is a URL if the collection type requires it
  if (
    config.requiredDataType === 'url' &&
    (typeof data !== 'string' || !isValidUrl(data))
  ) {
    throw new InvalidParameterError('Invalid data type. Expected a URL.');
  }

  // Create the entry
  const properties = generateDefaultCollectionEntryProperties(collection);
  const metadata = { created: new Date(), lastModified: new Date() };
  const entry = await config.createEntry(path, properties, metadata, data);

  // Add the entry to the entries store
  CollectionEntriesStore.add(entry);

  // Dispatch the entry created event
  Events.dispatch('collections:entries:create', entry);

  return entry as TEntry;
}
