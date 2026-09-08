import { Fs } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { ViewsDirName } from '../constants';

/**
 * Returns the path to the active workspace's data views directory.
 *
 * @returns The path to the data views directory.
 */
export function resolveViewsDirPath(): string {
  return Fs.concatPath(Paths.workspace, Paths.hiddenDirName, ViewsDirName);
}
