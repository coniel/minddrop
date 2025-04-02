import { CollectionsStore } from '../CollectionsStore';
import { Collection } from '../types';

/**
 * Returns a collection by path, or null if it does not exist.
 *
 * @param path - The collection path.
 * @returns A collection or null.
 */
export function getCollection(path: string): Collection | null {
  return CollectionsStore.getState().collections[path] || null;
}
