import { Fs } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { CollectionsDirName } from '../constants';

/**
 * Returns the path to the collections directory within the workspace.
 *
 * @returns The path to the collections directory.
 */
export function resolveCollectionsDirPath() {
  return Fs.concatPath(
    Paths.workspace,
    Paths.hiddenDirName,
    CollectionsDirName,
  );
}
