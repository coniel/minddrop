import { Fs } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { PagesDirName } from '../constants';

/**
 * Returns the path to the pages directory within the workspace.
 *
 * @returns The path to the pages directory.
 */
export function getPagesDirPath() {
  return Fs.concatPath(Paths.workspace, Paths.hiddenDirName, PagesDirName);
}
