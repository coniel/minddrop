import { Fs } from '@minddrop/file-system';
import { QueryFileExtension } from '../constants';
import { resolveQueriesDirPath } from './resolveQueriesDirPath';

/**
 * Returns the path to a query file.
 *
 * @param id - The ID of the query.
 * @returns The path to the query file.
 */
export function resolveQueryFilePath(id: string) {
  return Fs.concatPath(
    resolveQueriesDirPath(),
    Fs.addFileExtension(id, QueryFileExtension),
  );
}
