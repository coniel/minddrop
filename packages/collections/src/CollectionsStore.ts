import { createObjectStore } from '@minddrop/stores';
import { Collection } from './types';

export const CollectionsStore = createObjectStore<Collection>(
  'Collections:Collections',
  'id',
);

/**
 * Retrieves a Collection by ID or null if it doesn't exist.
 *
 * @param id - The ID of the collection to retrieve.
 * @returns The collection or null if it doesn't exist.
 */
export const useCollection = (id: string): Collection | null => {
  return CollectionsStore.useItem(id);
};

/**
 * Retrieves all collections.
 *
 * @returns An array of all collections.
 */
export const useCollections = (): Collection[] => {
  return CollectionsStore.useAllItemsArray();
};
