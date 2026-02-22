import { Fs } from '@minddrop/file-system';
import { View } from '../types';

/**
 * Reads a view from the file system.
 *
 * @param path - The path to the view file.
 * @returns The view or null if it doesn't exist.
 */
export async function readView(path: string): Promise<View | null> {
  try {
    // Read and parse the view file
    const view = await Fs.readJsonFile<View>(path);

    return view;
  } catch {
    return null;
  }
}
