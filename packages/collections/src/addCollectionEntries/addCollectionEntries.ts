import { getCollection } from '../getCollection';
import { Collection } from '../types';
import { updateCollection } from '../updateCollection';

/**
 * Adds entries to a collection, updating the store and writing to the
 * file system. Duplicate entry IDs are ignored.
 *
 * @param collectionId - The ID of the collection to add entries to.
 * @param entryIds - The entry IDs to add.
 * @returns The updated collection.
 *
 * @dispatches 'collections:collection:updated' event
 */
export async function addCollectionEntries(
  collectionId: string,
  entryIds: string[],
): Promise<Collection> {
  // Get the collection
  const collection = getCollection(collectionId);

  // Merge new entry IDs, filtering out duplicates
  const mergedEntries = Array.from(
    new Set([...collection.entries, ...entryIds]),
  );

  // Update the collection with the merged entries
  return updateCollection(collectionId, { entries: mergedEntries });
}
