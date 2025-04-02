import { Events } from '@minddrop/events';
import { CollectionsStore } from '../CollectionsStore';
import { collectionExists } from '../collectionExists';
import { CollectionNotFoundError } from '../errors';
import { getCollection } from '../getCollection';
import { Collection, UpdateCollectionData } from '../types';
import { writeCollectionConfig } from '../writeCollectionConfig';

/**
 * Updates a collection by path with the given data.
 *
 * @param path - The path of the collection to update.
 * @param data - The data to update the collection with.
 * @returns The updated collection.
 *
 * @dispatches collections:collection:update
 *
 * @throws {CollectionNotFoundError} Thrown if the collection does not exist.
 */
export async function updateCollection(
  path: string,
  data: UpdateCollectionData,
): Promise<Collection> {
  const collection = getCollection(path);

  // Ensure that the collection exists
  if (!collection || !(await collectionExists(path))) {
    throw new CollectionNotFoundError(path);
  }

  // Update the collection data
  const update = {
    ...data,
    lastModified: new Date(),
  };
  const updatedCollection = {
    ...collection,
    ...update,
  };

  // Update the collection in the store
  CollectionsStore.getState().update(path, update);

  // Write the updated collection to the file system
  await writeCollectionConfig(path);

  // Dispatch a collection update event
  Events.dispatch('collections:collection:update', updatedCollection);

  return updatedCollection;
}
