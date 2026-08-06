import { getCollection } from '../getCollection';
import { Collection } from '../types';
import { updateCollection } from '../updateCollection';

/**
 * Removes items from a collection, updating the store and writing to the
 * file system. Item IDs that are not in the collection are ignored.
 *
 * @param collectionId - The ID of the collection to remove items from.
 * @param itemIds - The item IDs to remove.
 * @returns The updated collection.
 *
 * @dispatches 'collections:collection:updated' event
 */
export async function removeCollectionItems(
  collectionId: string,
  itemIds: string[],
): Promise<Collection> {
  // Get the collection
  const collection = getCollection(collectionId);

  // Filter out the items to remove
  const filteredItems = collection.items.filter((id) => !itemIds.includes(id));

  // Update the collection with the filtered items
  return updateCollection(collectionId, { items: filteredItems });
}
