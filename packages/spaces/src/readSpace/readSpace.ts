import { Fs } from '@minddrop/file-system';
import { Space } from '../types';

/**
 * Reads a space from the file system.
 *
 * @param path - The path to the space file.
 * @returns The space or null if it doesn't exist.
 */
export async function readSpace(path: string): Promise<Space | null> {
  try {
    // Read the space config from the file system
    const space = await Fs.readJsonFile<Space>(path);

    return space;
  } catch {
    return null;
  }
}
