import { CollectionsStore } from './CollectionsStore';
import { Collection } from './types';

/**
 * Returns all collections sorted by name.
 *
 * @returns All collections sorted by name.
 */
export function useCollections(): Collection[] {
  const { collections } = CollectionsStore();

  return Object.values(collections).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
}
