import { Events } from '@minddrop/events';
import { Fs, InvalidPathError, PathConflictError } from '@minddrop/file-system';
import { uuid } from '@minddrop/utils';
import { CollectionsStore } from '../CollectionsStore';
import { Collection } from '../types';

export type CreateCollectionOptions = Pick<
  Collection,
  'type' | 'name' | 'itemName' | 'description' | 'icon'
>;

/**
 * Creates a new collection in the specified directory.
 *
 * @param basePath The path to the directory where the collection will be created.
 * @param options The collection options.
 * @returns The new collection.
 *
 * @dispatches collections:collection:create
 *
 * @throws {InvalidPathError} If the specified path is invalid.
 * @throws {PathConflictError} If the specified path already exists.
 */
export async function createCollection(
  basePath: string,
  options: CreateCollectionOptions,
): Promise<Collection> {
  // Use the collection name as the collection's directory name
  const path = Fs.concatPath(basePath, options.name);

  // Ensure that the parent directory exists
  if (!(await Fs.exists(basePath))) {
    throw new InvalidPathError(basePath);
  }

  // Ensuse that the new collection path does not already exist
  if (await Fs.exists(path)) {
    throw new PathConflictError(path);
  }

  const collection: Collection = {
    ...options,
    created: new Date(),
    lastModified: new Date(),
  };

  // Create the new collection directory
  await Fs.createDir(path);

  // Create the collection metadata file inside a hidden directory
  // within the collection directory.
  await Fs.createDir(Fs.concatPath(path, '.minddrop'));
  await Fs.writeTextFile(
    Fs.concatPath(path, '.minddrop', 'collection.json'),
    JSON.stringify(collection),
  );

  // Add the collection to the store
  CollectionsStore.getState().add(collection);

  // Dispatch a collection create event
  Events.dispatch('collections:collection:create', collection);

  return collection;
}
