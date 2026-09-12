import { Fs } from '@minddrop/file-system';
import { CollectionFileExtension } from '../constants';
import { resolveCollectionsDirPath } from './resolveCollectionsDirPath';

/**
 * Returns the path to a collection file.
 *
 * @param id - The ID of the collection.
 * @param workspacePath - The workspace path. Defaults to the active workspace.
 * @returns The path to the collection file.
 */
export function resolveCollectionFilePath(id: string, workspacePath?: string) {
  return Fs.concatPath(
    resolveCollectionsDirPath(workspacePath),
    Fs.addFileExtension(id, CollectionFileExtension),
  );
}
