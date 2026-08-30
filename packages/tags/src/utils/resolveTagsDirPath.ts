import { Fs } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { TagsDirName } from '../constants';

/**
 * Returns the path to the tags directory within the workspace.
 *
 * @returns The path to the tags directory.
 */
export function resolveTagsDirPath() {
  return Fs.concatPath(Paths.workspace, Paths.hiddenDirName, TagsDirName);
}
