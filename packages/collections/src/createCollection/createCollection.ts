import { Events } from '@minddrop/events';
import { Fs, InvalidPathError, PathConflictError } from '@minddrop/file-system';
import { CollectionsStore } from '../CollectionsStore';
import { Collection, CollectionConfig } from '../types';

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

  // Ensure that the new collection path does not already exist
  if (await Fs.exists(path)) {
    throw new PathConflictError(path);
  }

  // Generate the collection config
  const config: CollectionConfig = {
    ...options,
    created: new Date(),
    lastModified: new Date(),
  };
  // Generate the collection object
  const collection: Collection = {
    ...config,
    path,
  };

  // Create the new collection directory
  await Fs.createDir(path);

  // Create the collection metadata file inside a hidden directory
  // within the collection directory.
  await Fs.createDir(Fs.concatPath(path, '.minddrop'));
  await Fs.writeTextFile(
    Fs.concatPath(path, '.minddrop', 'collection.json'),
    JSON.stringify(config),
  );

  // Add the collection to the store
  CollectionsStore.getState().add({ ...collection, path });

  // Dispatch a collection create event
  Events.dispatch('collections:collection:create', { ...collection, path });

  return collection;
}
