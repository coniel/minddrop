import { Fs } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { SpacesDirName } from '../constants';

/**
 * Returns the path to the spaces directory within the workspace.
 *
 * @returns The path to the spaces directory.
 */
export function getSpacesDirPath() {
  return Fs.concatPath(Paths.workspace, Paths.hiddenDirName, SpacesDirName);
}
