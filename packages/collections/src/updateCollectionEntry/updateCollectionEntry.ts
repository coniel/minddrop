import { Events } from '@minddrop/events';
import { updateCollectionEntry as updateInStore } from '../CollectionEntriesStore';
import { getCollection } from '../getCollection';
import { getCollectionEntry } from '../getCollectionEntry';
import { getCollectionTypeConfig } from '../getCollectionTypeConfig';
import { CollectionEntry } from '../types';

/**
 * Updates a collection entry.
 *
 * @param collectionPath - The path of the collection.
 * @param entryPath - The path of the entry.
 * @param updates - The updates to apply to the entry.
 * @returns The updated collection entry.
 *
 * @throws {CollectionNotFoundError} If the collection does not exist.
 * @throws {CollectionTypeConfigNotFoundError} If the collection type config does not exist.
 * @throws {CollectionEntryNotFoundError} If the entry does not exist.
 *
 * @dispatches collections:entry:update
 */
export async function updateCollectionEntry(
  collectionPath: string,
  entryPath: string,
  updates: Partial<CollectionEntry>,
): Promise<CollectionEntry> {
  // Get the collection
  const collection = getCollection(collectionPath, true);
  // Get the collection type config
  const config = getCollectionTypeConfig(collection.type);
  // Get the entry
  const entry = getCollectionEntry(entryPath, true);

  // Merge updates into the existing properties
  let updatedEntry = {
    ...entry,
    ...updates,
    metadata: {
      ...entry.metadata,
      lastModified: new Date(),
    },
  };

  // Update the entry files using the collection type config.
  // The config may further process the entry before saving it,
  // so we use the returned entry as the updated entry.
  updatedEntry = await config.updateEntry(updatedEntry);

  // Update the entry in the store
  updateInStore(entry.path, updatedEntry);

  // Dispatch a entry updated event
  Events.dispatch('collections:entry:update', updatedEntry);

  return updatedEntry;
}
