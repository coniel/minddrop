import { MediaDirName } from '@minddrop/designs';
import { Fs } from '@minddrop/file-system';
import { resolveSpaceBundleDirPath } from './resolveSpaceBundleDirPath';

/**
 * Returns the path to a space's media directory, which contains
 * the media files used by the space's layout. Spaces store media
 * under the same directory name as designs, since a space's layout
 * references media files the same way a design's layouts do.
 *
 * @param id - The ID of the space.
 * @returns The path to the space media directory.
 */
export function resolveSpaceMediaDirPath(id: string) {
  return Fs.concatPath(resolveSpaceBundleDirPath(id), MediaDirName);
}
