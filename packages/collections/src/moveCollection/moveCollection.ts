import { Events } from '@minddrop/events';
import { Fs, InvalidPathError, PathConflictError } from '@minddrop/file-system';
import { CollectionsStore } from '../CollectionsStore';
import { getCollection } from '../getCollection';
import { writeCollectionsConfig } from '../writeCollectionsConfig';

/**
 * Moves a collection folder to a new location and updates the collections config file.
 *
 * @param path - The current collection path.
 * @param destinationPath - The path to which to move the collection dir.
 *
 * @dispatches collections:collection:move
 *
 * @throws {InvalidPathError} - Destination or collection path does not exist.
 * @throws {PathConflictError} - A dir of the same name already exists in the destination dir.
 */
export async function moveCollection(
  path: string,
  destinationPath: string,
): Promise<void> {
  // Get the collection from the store
  const collection = getCollection(path);
  // Get collection dir name from its path
  const collectionDir = Fs.fileNameFromPath(path);
  // Generate the new collection path
  const newPath = Fs.concatPath(destinationPath, collectionDir);

  if (!collection) {
    return;
  }

  // Ensure collection dir exists
  if (!(await Fs.exists(path))) {
    throw new InvalidPathError(destinationPath);
  }

  // Ensure destination dir exists
  if (!(await Fs.exists(destinationPath))) {
    throw new InvalidPathError(destinationPath);
  }

  // Ensure there is no conflict
  if (await Fs.exists(newPath)) {
    throw new PathConflictError(newPath);
  }

  // Move the collection dir
  await Fs.rename(path, newPath);

  // Remove old version of the collection
  CollectionsStore.getState().remove(path);
  // Add new version of the collection
  CollectionsStore.getState().add({ ...collection, path: newPath });

  // Update collections config file
  await writeCollectionsConfig();

  // Dispatch a collection move event
  Events.dispatch('collections:collection:move', { oldPath: path, newPath });
}
