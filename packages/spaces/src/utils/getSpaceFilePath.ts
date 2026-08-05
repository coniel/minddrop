import { Fs } from '@minddrop/file-system';
import { SpaceFileExtension } from '../constants';
import { getSpacesDirPath } from './getSpacesDirPath';

/**
 * Returns the path to a space file.
 *
 * @param id - The ID of the space.
 * @returns The path to the space file.
 */
export function getSpaceFilePath(id: string) {
  return Fs.concatPath(
    getSpacesDirPath(),
    Fs.addFileExtension(id, SpaceFileExtension),
  );
}
