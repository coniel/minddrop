import { Fs } from '@minddrop/file-system';
import { getQuery } from '../getQuery';
import { getQueriesDirPath, getQueryFilePath } from '../utils';

/**
 * Writes a query to the file system.
 *
 * @param id - The ID of the query to write.
 * @throws {QueryNotFoundError} If the query does not exist.
 */
export async function writeQuery(id: string): Promise<void> {
  // Get the query
  const query = getQuery(id);

  // Ensure the queries directory exists
  await Fs.ensureDir(getQueriesDirPath());

  // Write the query config to the file system
  Fs.writeJsonFile(getQueryFilePath(id), query);
}
