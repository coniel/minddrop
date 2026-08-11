import { Fs } from '@minddrop/file-system';
import { SpaceFileName } from '../constants';
import { resolveSpaceBundleDirPath } from './resolveSpaceBundleDirPath';

/**
 * Returns the path to a space file inside its bundle directory.
 *
 * @param id - The ID of the space.
 * @returns The path to the space file.
 */
export function resolveSpaceFilePath(id: string) {
  return Fs.concatPath(resolveSpaceBundleDirPath(id), SpaceFileName);
}
