import { Fs } from '@minddrop/file-system';
import { Page } from '../types';

/**
 * Reads a page from the file system.
 *
 * @param path - The path to the page file.
 * @returns The page or null if it doesn't exist.
 */
export async function readPage(path: string): Promise<Page | null> {
  try {
    // Read the page config from the file system
    const page = await Fs.readJsonFile<Page>(path);

    return page;
  } catch {
    return null;
  }
}
