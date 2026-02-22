import { Fs } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { DesignsDirName } from '../constants';

/**
 * Returns the path to the workspace designs directory.
 *
 * @returns The path to the designs directory.
 */
export function getDesignsDirPath() {
  return Fs.concatPath(Paths.workspace, Paths.hiddenDirName, DesignsDirName);
}
