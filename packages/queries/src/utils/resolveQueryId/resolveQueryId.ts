import { Fs } from '@minddrop/file-system';
import { QueryFileExtension } from '../../constants';
import { resolveQueriesDirPath } from '../resolveQueriesDirPath';

/**
 * Returns the ID of the query stored at the given path, or null if
 * the path is not a query file. Query files are named by their ID.
 *
 * @param path - The path to resolve.
 * @returns The query ID or null if the path is not a query file.
 */
export function resolveQueryId(path: string): string | null {
  // Query files sit directly in the queries directory
  if (Fs.parentDirPath(path) !== resolveQueriesDirPath()) {
    return null;
  }

  const fileName = Fs.fileNameFromPath(path);

  // Ignore other files that may end up in the directory
  if (Fs.getExtension(fileName) !== QueryFileExtension) {
    return null;
  }

  return Fs.removeExtension(fileName);
}
