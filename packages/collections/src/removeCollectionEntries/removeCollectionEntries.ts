import { getCollection } from '../getCollection';
import { Collection } from '../types';
import { updateCollection } from '../updateCollection';

/**
 * Removes entries from a collection, updating the store and writing to the
 * file system. Entry IDs that are not in the collection are ignored.
 *
 * @param collectionId - The ID of the collection to remove entries from.
 * @param entryIds - The entry IDs to remove.
 * @returns The updated collection.
 *
 * @dispatches 'collections:collection:updated' event
 */
export async function removeCollectionEntries(
  collectionId: string,
  entryIds: string[],
): Promise<Collection> {
  // Get the collection
  const collection = getCollection(collectionId);

  // Filter out the entries to remove
  const filteredEntries = collection.entries.filter(
    (id) => !entryIds.includes(id),
  );

  // Update the collection with the filtered entries
  return updateCollection(collectionId, { entries: filteredEntries });
}
