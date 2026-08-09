import { Fs } from '@minddrop/file-system';
import { restoreDates } from '@minddrop/utils';
import { Query } from '../types';

/**
 * Reads a query from the file system, reviving serialized
 * dates.
 *
 * @param path - The path to the query file.
 * @returns The query or null if it doesn't exist or is invalid.
 */
export async function readQuery(path: string): Promise<Query | null> {
  try {
    // Read the query config from the file system
    const query = await Fs.readJsonFile<Query>(path);

    // Discard files predating the rules based query model
    if (!query.rules) {
      return null;
    }

    // Revive serialized dates
    return restoreDates<Query>(query);
  } catch {
    return null;
  }
}
