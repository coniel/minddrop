import { Fs } from '@minddrop/file-system';
import { Query } from '../types';

/**
 * Reads a query from the file system.
 *
 * @param path - The path to the query file.
 * @returns The query or null if it doesn't exist.
 */
export async function readQuery(path: string): Promise<Query | null> {
  try {
    // Read the query config from the file system
    const query = await Fs.readJsonFile<Query>(path);

    return query;
  } catch {
    return null;
  }
}
