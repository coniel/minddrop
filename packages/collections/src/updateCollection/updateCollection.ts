import { Events } from '@minddrop/events';
import { InvalidParameterError } from '@minddrop/utils';
import { CollectionsStore } from '../CollectionsStore';
import { CollectionUpdatedEvent } from '../events';
import { getCollection } from '../getCollection';
import {
  Collection,
  UpdateCollectionData,
  UpdateVirtualCollectionData,
} from '../types';
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
  data: UpdateCollectionData | UpdateVirtualCollectionData,
): Promise<Collection> {
  // Get the collection
  const collection = getCollection(collectionId);

  // Update the collection
  const updatedCollection: Collection = {
    ...collection,
    ...data,
    lastModified: new Date(),
  };

  // If the ID is changing (virtual collections only), remove the old
  // entry and set the new one
  if ('id' in data && data.id && data.id !== collectionId) {
    if (!collection.virtual) {
      throw new InvalidParameterError(
        'Cannot change the ID of a non-virtual collection',
      );
    }

    CollectionsStore.remove(collectionId);
    CollectionsStore.set(updatedCollection);
  } else {
    // Update the collection in the store
    CollectionsStore.update(collectionId, {
      ...data,
      lastModified: new Date(),
    });
  }

  // Write the collection config to the file system if not virtual
  if (!collection.virtual) {
    await writeCollection(collectionId);
  }

  // Dispatch the collection updated event
  Events.dispatch(CollectionUpdatedEvent, {
    original: collection,
    updated: updatedCollection,
  });

  return updatedCollection;
}
