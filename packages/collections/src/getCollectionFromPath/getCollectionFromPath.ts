import { Fs, InvalidPathError } from '@minddrop/file-system';
import {
  CollectionConfigDirName,
  CollectionConfigFileName,
} from '../constants';
import { CollectionConfigParseError, CollectionNotFoundError } from '../errors';
import { Collection } from '../types';

/**
 * Gets a collection from its directory.
 *
 * @param path - Path to the collection directory.
 * @returns The collection config.
 *
 * @throws {InvalidPathError} - If the path does not exist.
 * @throws {CollectionNotFoundError} - If the path is not a collection.
 * @throws {CollectionConfigParseError} - If the collection config file is invalid.
 */
export async function getCollectionFromPath(path: string): Promise<Collection> {
  // Ensure collection dir exists
  if (!(await Fs.exists(path))) {
    throw new InvalidPathError(path);
  }

  // Create collection's config file path
  const configPath = Fs.concatPath(
    path,
    CollectionConfigDirName,
    CollectionConfigFileName,
  );

  // Ensure the collection config file exists
  if (!(await Fs.exists(configPath))) {
    throw new CollectionNotFoundError(path);
  }

  try {
    // Read and parse the collection config file
    const configJson = await Fs.readTextFile(configPath);
    const parsed = JSON.parse(configJson);

    // Return the collection
    return {
      ...parsed,
      path,
      created: new Date(parsed.created),
      lastModified: new Date(parsed.lastModified),
    };
  } catch (error) {
    throw new CollectionConfigParseError(path);
  }
}
