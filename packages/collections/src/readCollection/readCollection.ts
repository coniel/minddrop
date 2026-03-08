import { Fs } from '@minddrop/file-system';
import { Collection } from '../types';

/**
 * Reads a collection from the file system.
 *
 * @param path - The path to the collection file.
 * @returns The collection or null if it doesn't exist.
 */
export async function readCollection(path: string): Promise<Collection | null> {
  try {
    // Read the collection config from the file system
    return await Fs.readJsonFile<Collection>(path);
  } catch {
    return null;
  }
}
