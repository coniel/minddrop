import { Events } from '@minddrop/events';
import { Fs, InvalidPathError, PathConflictError } from '@minddrop/file-system';
import { InvalidParameterError } from '@minddrop/utils';
import { CollectionsStore } from '../CollectionsStore';
import { getCollection } from '../getCollection';
import { Collection } from '../types';
import { writeCollectionConfig } from '../writeCollectionConfig';
import { writeCollectionsConfig } from '../writeCollectionsConfig';

/**
 * Renames a collection and its directory.
 *
 * @param path - The collection path.
 * @param name - The new collection name.
 * @returns The updated collection.
 *
 * @dispatches collections:collection:rename
 *
 * @throws {InvalidPathError} - the collection path does not exist.
 * @throws {PathConflictError} - the new name conflicts with an existing dir.
 */
export async function renameCollection(
  path: string,
  name: string,
): Promise<Collection> {
  // Get the collection
  const collection = getCollection(path);
  // Generate the new collection path
  const newPath = `${path.split('/').slice(0, -1).join('/')}/${name}`;

  // Ensure collection exists
  if (!collection) {
    throw new InvalidParameterError(`no such collection: ${path}`);
  }

  // Ensure collection dir exists
  if (!(await Fs.exists(path))) {
    throw new InvalidPathError(path);
  }

  // Ensure new name does not cause a conflict
  if (await Fs.exists(newPath)) {
    throw new PathConflictError(newPath);
  }

  // Update the collection dir name
  await Fs.rename(path, newPath);

  // Generate the updated collection object
  const updatedCollection = { ...collection, name, path: newPath };

  // Remove old version of the collection from store
  CollectionsStore.getState().remove(path);
  // Add new version of the collection to store
  CollectionsStore.getState().add(updatedCollection);

  // Write the collection config file
  await writeCollectionConfig(newPath);

  // Update collections config file
  await writeCollectionsConfig();

  // Dispatch a collection rename event
  Events.dispatch('collections:collection:rename', { oldPath: path, newPath });

  return updatedCollection;
}
