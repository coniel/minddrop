import { Fs } from '@minddrop/file-system';
import { InvalidParameterError } from '@minddrop/utils';
import { getCollection } from '../getCollection';
import { getCollectionFilePath, getCollectionsDirPath } from '../utils';

/**
 * Writes a collection to the file system.
 *
 * @param id - The ID of the collection to write.
 *
 * @throws InvalidParameterError if the collection is virtual.
 */
export async function writeCollection(id: string): Promise<void> {
  // Get the collection
  const collection = getCollection(id);

  // Virtual collections cannot be written to the file system
  if (collection.virtual) {
    throw new InvalidParameterError(
      'Cannot write a virtual collection to the file system',
    );
  }

  // Ensure the collections directory exists
  await Fs.ensureDir(getCollectionsDirPath());

  // Write the collection config
  Fs.writeJsonFile(getCollectionFilePath(id), collection);
}
