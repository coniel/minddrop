import { Fs } from '@minddrop/file-system';
import { resolveSpacesDirPath } from './resolveSpacesDirPath';

/**
 * Returns the path to a space's bundle directory, which contains
 * the space file along with the space's media files.
 *
 * @param id - The ID of the space.
 * @returns The path to the space bundle directory.
 */
export function resolveSpaceBundleDirPath(id: string) {
  return Fs.concatPath(resolveSpacesDirPath(), id);
}
