import { Fs } from '@minddrop/file-system';
import { CollectionFileExtension } from '../constants';
import { getCollectionsDirPath } from './getCollectionsDirPath';

/**
 * Returns the path to a collection file.
 *
 * @param id - The ID of the collection.
 * @returns The path to the collection file.
 */
export function getCollectionFilePath(id: string) {
  return Fs.concatPath(
    getCollectionsDirPath(),
    Fs.addFileExtension(id, CollectionFileExtension),
  );
}
