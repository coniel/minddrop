import { CollectionsStore } from '../../CollectionsStore';
import { Collection } from '../../types';

/**
 * Returns the most recently created collections, newest first.
 *
 * @param limit - Maximum number of collections to return.
 * @returns The most recently created collections.
 */
export function getRecentCollections(limit: number): Collection[] {
  // Sort a copy by creation date, newest first, and cap the result
  // at the limit.
  return [...CollectionsStore.getAllArray()]
    .sort(
      (collectionA, collectionB) =>
        collectionB.created.getTime() - collectionA.created.getTime(),
    )
    .slice(0, limit);
}
