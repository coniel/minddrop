import { Events } from '@minddrop/events';
import { removeCollectionEntry } from '../CollectionEntriesStore';
import { getCollection } from '../getCollection';
import { getCollectionEntry } from '../getCollectionEntry';
import { getCollectionTypeConfig } from '../getCollectionTypeConfig';

/**
 * Deletes a collection entry.
 *
 * @param collectionPath - The path to the collection.
 * @param entryPath - The path to the entry.
 *
 * @throws {CollectionNotFoundError} If the collection does not exist.
 * @throws {CollectionTypeNotRegisteredError} If the collection type config is not registered.
 * @throws {CollectionEntryNotFoundError} If the entry does not exist.
 *
 * @dispatches collections:entry:delete
 */
export async function deleteCollectionEntry(
  collectionPath: string,
  entryPath: string,
): Promise<void> {
  // Get the collection
  const collection = getCollection(collectionPath, true);
  // Get the collection type config
  const config = getCollectionTypeConfig(collection.type);
  // Get the entry
  const entry = getCollectionEntry(entryPath, true);

  // Remove the entry from the store
  removeCollectionEntry(entryPath);

  // Call the delete entry function from the collection type config.
  // This method should handle the actual deletion of the entry from the file system.
  config.deleteEntry(entry);

  // Dispatch the entry delete event
  Events.dispatch('collections:entry:delete', entry);
}
