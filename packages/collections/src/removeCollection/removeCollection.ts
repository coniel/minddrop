import { Events } from '@minddrop/events';
import { CollectionsStore } from '../CollectionsStore';
import { getCollection } from '../getCollection';
import { writeCollectionsConfig } from '../writeCollectionsConfig';

/**
 * Removes a collectionace from the store but retains
 * the collection dir.
 * Dispatches a 'collections:collection:remove' event.
 *
 * @param path - The collection path.
 */
export async function removeCollection(path: string): Promise<void> {
  // Get the collection
  const collection = getCollection(path);

  // Do nothing if collection does not exist
  if (!collection) {
    return;
  }

  // Remove the collection from the store
  CollectionsStore.getState().remove(path);

  // Update the collections config file
  await writeCollectionsConfig();

  // Dispatch a 'collections:collection:remove' event
  Events.dispatch('collections:collection:remove', collection);
}
