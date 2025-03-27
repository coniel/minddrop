import { Events } from '@minddrop/events';
import { Fs, InvalidPathError } from '@minddrop/file-system';
import { CollectionsStore } from '../CollectionsStore';
import { Collection } from '../types';

/**
 * Scans the target directory for collections and loads them into the store.
 *
 * @param path - The target directory path.
 *
 * @dispatches collections:load
 *
 * @throws {InvalidPathError} If the path does not exist.
 */
export async function loadCollections(path: string): Promise<void> {
  // Ensure the path exists
  if (!(await Fs.exists(path))) {
    throw new InvalidPathError(path);
  }

  // Fetch directories from the target path
  const contents = await Fs.readDir(path);
  const collections: Collection[] = [];

  // Check each directory for a collection file. If it exists, parse
  // the collection JSON file and add it to the collections array.
  await Promise.all(
    contents.map(async (dir) => {
      const collectionPath = `${path}/${dir.name}/.minddrop/collection.json`;
      const isCollection = await Fs.exists(collectionPath);

      if (!isCollection) {
        return null;
      }

      const collectionJson = await Fs.readTextFile(collectionPath);

      try {
        const collection = JSON.parse(collectionJson);

        collections.push({
          ...collection,
          created: new Date(collection.created),
          lastModified: new Date(collection.lastModified),
        });

        return collection;
      } catch (err) {
        return null;
      }
    }),
  );

  // Load collections into the store
  CollectionsStore.getState().load(collections);

  // Dispatch a collections load event
  Events.dispatch('collections:load', collections);
}
