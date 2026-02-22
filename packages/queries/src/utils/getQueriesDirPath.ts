import { Fs } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { QueriesDirName } from '../constants';

/**
 * Returns the path to the queries directory within the workspace.
 *
 * @returns The path to the queries directory.
 */
export function getQueriesDirPath() {
  return Fs.concatPath(Paths.workspace, Paths.hiddenDirName, QueriesDirName);
}
