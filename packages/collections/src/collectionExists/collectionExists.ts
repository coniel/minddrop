import { Fs } from '@minddrop/file-system';
import {
  CollectionConfigDirName,
  CollectionConfigFileName,
} from '../constants';

/**
 * Checks whether a collection directory exists and contains a collection
 * config.
 *
 * @params path - The collection path.
 * @returns boolean indicating whether the collection exists.
 */
export async function collectionExists(path: string): Promise<boolean> {
  // Ensure the collection path exists
  const exists = await Fs.exists(path);

  if (!exists) {
    return false;
  }

  // Ensure the collection config file exists
  const configPath = Fs.concatPath(
    path,
    CollectionConfigDirName,
    CollectionConfigFileName,
  );

  return Fs.exists(configPath);
}
