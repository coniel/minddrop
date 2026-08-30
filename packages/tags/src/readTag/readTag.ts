import { Fs } from '@minddrop/file-system';
import { Tag } from '../types';

/**
 * Reads a tag from the file system.
 *
 * @param path - The path to the tag file.
 * @returns The tag or null if it doesn't exist.
 */
export async function readTag(path: string): Promise<Tag | null> {
  try {
    // Read the tag config from the file system
    return await Fs.readJsonFile<Tag>(path);
  } catch {
    return null;
  }
}
