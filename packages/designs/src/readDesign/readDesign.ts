import { Fs } from '@minddrop/file-system';
import { restoreDates } from '@minddrop/utils';
import { Design } from '../types';

/**
 * Reads a design from the file system.
 *
 * @param path - The path to the design file.
 * @returns The design or null if it doesn't exist.
 */
export async function readDesign(path: string): Promise<Design | null> {
  try {
    // Read the design from the file system
    const design = await Fs.readJsonFile<Design>(path);

    // Restore the path property
    return restoreDates<Design>({ ...design, path });
  } catch {
    // In case of an error, return null
    return null;
  }
}
