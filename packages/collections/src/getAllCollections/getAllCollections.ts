import { CollectionsStore } from '../CollectionsStore';
import { Collection } from '../types';

/**
 * Returns all collections from the collections store as an array.
 *
 * @returns All collections.
 */
export function getAllCollections(): Collection[] {
  return Object.values(CollectionsStore.getState().collections);
}
