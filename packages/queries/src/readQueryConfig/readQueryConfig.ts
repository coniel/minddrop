import { FileNotFoundError, Fs } from '@minddrop/file-system';
import { Query } from '../types';

/**
 * Reads a query config from the file system.
 *
 * @param path - The path to the query config file.
 * @returns The query.
 * @throws {FileNotFoundError} If the query config file does not exist.
 */
export async function readQueryConfig(path: string): Promise<Query> {
  // Ensure the query config files exists
  if (!(await Fs.exists(path))) {
    throw new FileNotFoundError(path);
  }

  // Read the query config from the file system
  const query = await Fs.readJsonFile<Query>(path);

  // Add the path to the query
  return { ...query, path };
}
