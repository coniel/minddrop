import { Events } from '@minddrop/events';
import { CollectionEntriesStore } from '../CollectionEntriesStore';
import { getCollection } from '../getCollection';
import { getCollectionTypeConfig } from '../getCollectionTypeConfig';

/**
 * Load collection entries from a given collection path.
 *
 * @param path - The path to the collection.
 *
 * @throws {CollectionTypeNotRegisteredError} If the collection type is not registered.
 * @throws {CollectionNotFoundError} If the collection does not exist.
 */
export async function loadCollectionEntries(path: string): Promise<void> {
  // Get the collection
  const collection = getCollection(path, true);
  // Get the collection type config
  const config = getCollectionTypeConfig(collection.type);

  // Retrieve the collection entries
  const entries = await config.getAllEntries(collection.path);

  // Load the entries into the entries store
  CollectionEntriesStore.load(entries);

  // Dispatch an entries load event
  Events.dispatch('collections:entries:load', entries);
}
