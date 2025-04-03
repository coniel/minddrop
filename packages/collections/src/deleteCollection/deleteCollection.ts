import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { getCollection } from '../getCollection';
import { removeCollection } from '../removeCollection';

/**
 * Deletes a collection dir and removes the collection
 * from the store.
 *
 * Dispatches a 'collections:collection:delete' event.
 *
 * @param path - The path of the collection to remove.
 */
export async function deleteCollection(path: string): Promise<void> {
  // Get the collection
  const collection = getCollection(path);

  // Do nothing if the collection does not exist
  if (!collection) {
    return;
  }

  // Remove the collection from the store
  await removeCollection(path);

  // Delete the collection directory
  await Fs.trashDir(path);

  // Dispatch a 'collections:worspace:delete' event
  Events.dispatch('collections:collection:delete', collection);
}
