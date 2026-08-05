import { Fs } from '@minddrop/file-system';
import { getSpace } from '../getSpace';
import { getSpaceFilePath, getSpacesDirPath } from '../utils';

/**
 * Writes a space to the file system.
 *
 * @param id - The ID of the space to write.
 * @throws {SpaceNotFoundError} If the space does not exist.
 */
export async function writeSpace(id: string): Promise<void> {
  // Get the space
  const space = getSpace(id);

  // Ensure the spaces directory exists
  await Fs.ensureDir(getSpacesDirPath());

  // Write the space config to the file system
  Fs.writeJsonFile(getSpaceFilePath(id), space);
}
