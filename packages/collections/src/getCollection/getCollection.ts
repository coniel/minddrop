import { CollectionsStore } from '../CollectionsStore';
import { CollectionNotFoundError } from '../errors';
import { Collection } from '../types';

/**
 * Retrieves a collection from the store by ID.
 *
 * @param id - The ID of the collection.
 * @param throwOnNotFound - Whether to throw an error if the collection is not found.
 * @param workspaceId - The workspace the collection belongs to. Omit for the active workspace.
 * @returns The collection object.
 *
 * @throws {CollectionNotFoundError} If the collection does not exist.
 */
export function getCollection(
  id: string,
  throwOnNotFound?: true,
  workspaceId?: string,
): Collection;
export function getCollection(
  id: string,
  throwOnNotFound: false,
  workspaceId?: string,
): Collection | null;
export function getCollection(
  id: string,
  throwOnNotFound = true,
  workspaceId?: string,
): Collection | null {
  // Get the collection from the workspace's store record
  const collection = CollectionsStore.in(workspaceId).get(id);

  // Throw an error if it doesn't exist, unless specified not to
  if (!collection && throwOnNotFound) {
    throw new CollectionNotFoundError(id);
  } else if (!collection && !throwOnNotFound) {
    return null;
  }

  return collection;
}
