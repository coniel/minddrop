import { getCollection } from '../getCollection';
import { Collection } from '../types';
import { updateCollection } from '../updateCollection';

/**
 * Adds items to a collection, updating the store and writing to the
 * file system. Duplicate item IDs are ignored.
 *
 * @param collectionId - The ID of the collection to add items to.
 * @param itemIds - The item IDs to add.
 * @returns The updated collection.
 *
 * @dispatches 'collections:collection:updated' event
 */
export async function addCollectionItems(
  collectionId: string,
  itemIds: string[],
): Promise<Collection> {
  // Get the collection
  const collection = getCollection(collectionId);

  // Merge new item IDs, filtering out duplicates
  const mergedItems = Array.from(new Set([...collection.items, ...itemIds]));

  // Update the collection with the merged items
  return updateCollection(collectionId, { items: mergedItems });
}
