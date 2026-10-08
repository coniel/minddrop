import { Fs } from '@minddrop/file-system';
import { ContentView } from '../types';
import { isStoredContentView } from '../utils';

/**
 * Reads a content view from the file system.
 *
 * @param path - The path to the content view file.
 * @returns The content view, or null if the file is missing or is not a valid content view.
 */
export async function readContentView(
  path: string,
): Promise<ContentView | null> {
  try {
    // Read and parse the content view file
    const view = await Fs.readJsonFile<ContentView>(path);

    // Return null if the file is not a content view
    if (!isStoredContentView(view)) {
      return null;
    }

    return view;
  } catch {
    // Return null if the file is missing or not valid JSON
    return null;
  }
}
