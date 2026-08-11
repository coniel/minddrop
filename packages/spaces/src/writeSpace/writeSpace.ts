import { Fs } from '@minddrop/file-system';
import { getSpace } from '../getSpace';
import { resolveSpaceBundleDirPath, resolveSpaceFilePath } from '../utils';

/**
 * Writes a space to the file system.
 *
 * @param id - The ID of the space to write.
 * @throws {SpaceNotFoundError} If the space does not exist.
 */
export async function writeSpace(id: string): Promise<void> {
  // Get the space
  const space = getSpace(id);

  // Ensure the space's bundle directory exists
  await Fs.ensureDir(resolveSpaceBundleDirPath(id));

  // Write the space config to the file system
  Fs.writeJsonFile(resolveSpaceFilePath(id), space);
}
