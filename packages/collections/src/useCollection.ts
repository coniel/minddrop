import { CollectionsStore } from './CollectionsStore';
import { Collection } from './types';

/**
 * Returns a collection by its path, or null if not found.
 *
 * @returns A collection or null.
 */
export function useCollection(path: string): Collection {
  const { collections } = CollectionsStore();

  return collections[path] || null;
}
