import { CollectionsStore } from '../CollectionsStore';
import { CollectionNotFoundError } from '../errors';
import { Collection } from '../types';

/**
 * Retrieves a collection from the store by ID.
 *
 * @param id - The ID of the collection.
 * @param throwOnNotFound - Whether to throw an error if the collection is not found.
 * @returns The collection object.
 *
 * @throws {CollectionNotFoundError} If the collection does not exist.
 */
export function getCollection(id: string): Collection;
export function getCollection(
  id: string,
  throwOnNotFound: false,
): Collection | null;
export function getCollection(
  id: string,
  throwOnNotFound = true,
): Collection | null {
  // Get the collection from the store
  const collection = CollectionsStore.get(id);

  // Throw an error if it doesn't exist, unless specified not to
  if (!collection && throwOnNotFound) {
    throw new CollectionNotFoundError(id);
  } else if (!collection && !throwOnNotFound) {
    return null;
  }

  return collection;
}
