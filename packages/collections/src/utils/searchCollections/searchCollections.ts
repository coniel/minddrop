import { fuzzySearch } from '@minddrop/utils';
import { CollectionsStore } from '../../CollectionsStore';
import { Collection } from '../../types';

/**
 * Performs a fuzzy search on collection names.
 *
 * @param query - The search query.
 * @param collections - IDs of the collections to include. All collections are included when omitted.
 * @returns The matched collections ranked by match quality.
 */
export function searchCollections(
  query: string,
  collections?: string[],
): Collection[] {
  const allCollections = CollectionsStore.getAllArray();

  // Filter collections to the given IDs when provided
  const searchedCollections = collections
    ? allCollections.filter((collection) => collections.includes(collection.id))
    : allCollections;

  // Map each name to its collections. A name can belong to
  // multiple collections so each maps to a list.
  const collectionsByName = new Map<string, Collection[]>();

  searchedCollections.forEach((collection) => {
    const nameCollections = collectionsByName.get(collection.name) ?? [];

    nameCollections.push(collection);
    collectionsByName.set(collection.name, nameCollections);
  });

  // Fuzzy match against collection names
  const matchedNames = fuzzySearch(
    searchedCollections.map((collection) => collection.name),
    query,
  );

  // Collect matched collections in rank order
  const matched: Collection[] = [];

  matchedNames.forEach((name) => {
    collectionsByName.get(name)?.forEach((collection) => {
      // Skip collections already matched via a duplicate name
      if (!matched.includes(collection)) {
        matched.push(collection);
      }
    });
  });

  return matched;
}
