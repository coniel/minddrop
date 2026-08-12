import { Fs } from '@minddrop/file-system';
import { CollectionFileExtension } from '../constants';
import { resolveCollectionsDirPath } from './resolveCollectionsDirPath';

/**
 * Returns the path to a collection file.
 *
 * @param id - The ID of the collection.
 * @returns The path to the collection file.
 */
export function resolveCollectionFilePath(id: string) {
  return Fs.concatPath(
    resolveCollectionsDirPath(),
    Fs.addFileExtension(id, CollectionFileExtension),
  );
}
