import { Fs } from '@minddrop/file-system';
import { ContentView } from '../types';

/**
 * Reads a content view from the file system.
 *
 * @param path - The path to the content view file.
 * @returns The content view or null if it doesn't exist.
 */
export async function readContentView(
  path: string,
): Promise<ContentView | null> {
  try {
    // Read and parse the content view file
    const view = await Fs.readJsonFile<ContentView>(path);

    return view;
  } catch {
    return null;
  }
}
