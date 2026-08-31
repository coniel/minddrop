import { Fs } from '@minddrop/file-system';
import { TagGroup } from '../types';

/**
 * Reads a tag group from the file system.
 *
 * @param path - The path to the tag group file.
 * @returns The tag group or null if it doesn't exist.
 */
export async function readTagGroup(path: string): Promise<TagGroup | null> {
  try {
    // Read the tag group config from the file system
    return await Fs.readJsonFile<TagGroup>(path);
  } catch {
    return null;
  }
}
