import { Fs } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { TagGroupsDirName } from '../constants';

/**
 * Returns the path to the tag groups directory within the
 * workspace.
 *
 * @returns The path to the tag groups directory.
 */
export function resolveTagGroupsDirPath() {
  return Fs.concatPath(Paths.workspace, Paths.hiddenDirName, TagGroupsDirName);
}
