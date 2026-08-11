import { CollectionsStore } from '../CollectionsStore';
import { Collection } from '../types';

/**
 * Retrieves all collections, including virtual ones.
 *
 * @returns All collections.
 */
export function getAllCollections(): Collection[] {
  return CollectionsStore.getAllArray();
}
