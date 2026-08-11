import { Fs } from '@minddrop/file-system';
import { SpaceFileName } from '../constants';
import { Space } from '../types';

/**
 * Reads a space from its bundle directory.
 *
 * @param bundleDirPath - The path to the space bundle directory.
 * @returns The space, or null if the directory is not a space bundle.
 */
export async function readSpace(bundleDirPath: string): Promise<Space | null> {
  try {
    // Read the space config from its bundle directory
    const space = await Fs.readJsonFile<Space>(
      Fs.concatPath(bundleDirPath, SpaceFileName),
    );

    return space;
  } catch {
    // The space file is missing or invalid
    return null;
  }
}
