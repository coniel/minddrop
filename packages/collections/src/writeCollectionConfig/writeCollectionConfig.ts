import { Fs, InvalidPathError } from '@minddrop/file-system';
import { InvalidParameterError } from '@minddrop/utils';
import {
  CollectionConfigDirName,
  CollectionConfigFileName,
} from '../constants';
import { getCollection } from '../getCollection';

/**
 * Writes the relevant values from the current collection state
 * to its config file.
 *
 * @param path - The collection path.
 *
 * @throws {InvalidParameterError} - Collection does not exist.
 * @throws {InvalidPathError} - Collection dir does not exist.
 */
export async function writeCollectionConfig(path: string): Promise<void> {
  // Get the collection from the store
  const collection = getCollection(path);

  // Ensure collection exists
  if (!collection) {
    throw new InvalidParameterError(`Collection does not exist: ${path}`);
  }

  // Ensure collection dir exists
  if (!(await Fs.exists(path))) {
    throw new InvalidPathError(path);
  }

  // Get only relevant values from store collection
  const { path: p, ...config } = collection;

  // Generate collection config's dir path
  const configDirPath = Fs.concatPath(path, CollectionConfigDirName);

  // Create hidden collection config's dir if it doesn't exist
  if (!(await Fs.exists(configDirPath))) {
    await Fs.createDir(configDirPath);
  }

  // Generate collection config's file path
  const configFilePath = Fs.concatPath(configDirPath, CollectionConfigFileName);

  // Write values to collection config file
  Fs.writeTextFile(configFilePath, JSON.stringify(config));
}
