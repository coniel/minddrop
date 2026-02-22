import { Fs } from '@minddrop/file-system';
import { QueryFileExtension } from '../constants';
import { getQueriesDirPath } from './getQueriesDirPath';

/**
 * Returns the path to a query file.
 *
 * @param id - The ID of the query.
 * @returns The path to the query file.
 */
export function getQueryFilePath(id: string) {
  return Fs.concatPath(
    getQueriesDirPath(),
    Fs.addFileExtension(id, QueryFileExtension),
  );
}
