import { CollectionsStore } from '../CollectionsStore';
import { CollectionNotFoundError } from '../errors';
import { Collection } from '../types';

/**
 * Returns a collection by path, or null if it does not exist.
 *
 * @param path - The collection path.
 * @returns A collection or null.
 *
 * @throws {CollectionNotFoundError} If the collection does not exist and `throwOnNotFound` is true.
 */
export function getCollection(path: string, throwOnNotFound: true): Collection;
export function getCollection(path: string): Collection | null;
export function getCollection(
  path: string,
  throwOnNotFound?: boolean,
): Collection | null {
  const collection = CollectionsStore.getState().collections[path] || null;

  if (!collection && throwOnNotFound) {
    throw new CollectionNotFoundError(path);
  }

  return collection;
}
