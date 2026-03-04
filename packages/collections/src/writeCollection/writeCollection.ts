import { Fs } from '@minddrop/file-system';
import { getCollection } from '../getCollection';
import { getCollectionFilePath, getCollectionsDirPath } from '../utils';

/**
 * Writes a collection to the file system.
 *
 * @param id - The ID of the collection to write.
 * @throws {CollectionNotFoundError} If the collection does not exist.
 */
export async function writeCollection(id: string): Promise<void> {
  // Get the collection
  const collection = getCollection(id);

  // Ensure the collections directory exists
  await Fs.ensureDir(getCollectionsDirPath());

  // Write the collection config to the file system
  Fs.writeJsonFile(getCollectionFilePath(id), collection);
}
