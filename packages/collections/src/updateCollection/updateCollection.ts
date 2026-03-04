import { Events } from '@minddrop/events';
import { CollectionsStore } from '../CollectionsStore';
import { CollectionUpdatedEvent } from '../events';
import { getCollection } from '../getCollection';
import { Collection, UpdateCollectionData } from '../types';
import { writeCollection } from '../writeCollection';

/**
 * Updates a collection, updating it in the store and writing it to the
 * file system.
 *
 * @param collectionId - The ID of the collection to update.
 * @param data - The collection data.
 * @returns The updated collection.
 *
 * @dispatches 'collections:collection:updated' event
 */
export async function updateCollection(
  collectionId: string,
  data: UpdateCollectionData,
): Promise<Collection> {
  // Get the collection
  const collection = getCollection(collectionId);

  // Update the collection
  const updatedCollection: Collection = {
    ...collection,
    ...data,
    lastModified: new Date(),
  };

  // Update the collection in the store
  CollectionsStore.update(collectionId, { ...data, lastModified: new Date() });

  // Write the collection config to the file system
  await writeCollection(collectionId);

  // Dispatch the collection updated event
  Events.dispatch(CollectionUpdatedEvent, {
    original: collection,
    updated: updatedCollection,
  });

  return updatedCollection;
}
