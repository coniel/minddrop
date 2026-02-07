import { Fs, InvalidPathError } from '@minddrop/file-system';
import { getQuery } from '../getQuery';

/**
 * Writes a query config to the file system.
 *
 * @param queryId - The ID of the query to write.
 * @throws {QueryNotFoundError} If the query does not exist.
 * @throws {InvalidPathError} If the parent directory of the query path does not exist.
 */
export async function writeQueryConfig(queryId: string): Promise<void> {
  // Get the query
  const { path, ...rest } = getQuery(queryId);

  // Ensure the parent directory exists
  if (!(await Fs.exists(Fs.parentDirPath(path)))) {
    throw new InvalidPathError(path);
  }

  // Write the query config to the file system
  Fs.writeJsonFile(path, rest);
}
