import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { CollectionsStore } from '../CollectionsStore';
import { CollectionDeletedEvent, CollectionDeletedEventData } from '../events';
import { getCollection } from '../getCollection';
import { getCollectionFilePath } from '../utils';

/**
 * Deletes a collection, removing it from the store and deleting it from the
 * file system.
 *
 * @param collectionId - The ID of the collection to delete.
 *
 * @dispatches collections:collection:deleted
 */
export async function deleteCollection(collectionId: string): Promise<void> {
  // Get the collection
  const collection = getCollection(collectionId);

  // Delete the collection from the store
  CollectionsStore.remove(collectionId);

  // Delete the collection config from the file system
  await Fs.removeFile(getCollectionFilePath(collectionId));

  // Dispatch the collection deleted event
  Events.dispatch<CollectionDeletedEventData>(
    CollectionDeletedEvent,
    collection,
  );
}
