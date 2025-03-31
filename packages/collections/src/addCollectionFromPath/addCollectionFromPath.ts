import { Events } from '@minddrop/events';
import { Fs, InvalidPathError } from '@minddrop/file-system';
import { CollectionsStore } from '../CollectionsStore';
import { getCollectionFromPath } from '../getCollectionFromPath';
import { Collection } from '../types';
import { writeCollectionsConfig } from '../writeCollectionsConfig';

/**
 * Adds a new collection to the store from the specified path.
 *
 * @param path - Absolute path to the collection directory.
 * @returns The new collection.
 *
 * @throws {InvalidPathError} - If the path does not exist.
 */
export async function addCollectionFromPath(path: string): Promise<Collection> {
  // Ensure path exists
  const exists = await Fs.exists(path);

  if (!exists) {
    throw new InvalidPathError(path);
  }

  // Get the collection config
  const collection = await getCollectionFromPath(path);

  // Add collection to store
  CollectionsStore.getState().add(collection);

  // Persist new collection to collections config file
  writeCollectionsConfig();

  // Dispatch a 'collections:collection:add' event
  Events.dispatch('collections:collection:add', collection);

  return collection;
}
