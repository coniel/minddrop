import { Fs } from '@minddrop/file-system';
import { QueryFileExtension } from '../constants';
import { resolveQueriesDirPath } from './resolveQueriesDirPath';

/**
 * Returns the path to a query file.
 *
 * @param id - The ID of the query.
 * @param workspacePath - The workspace path. Defaults to the active workspace.
 * @returns The path to the query file.
 */
export function resolveQueryFilePath(id: string, workspacePath?: string) {
  return Fs.concatPath(
    resolveQueriesDirPath(workspacePath),
    Fs.addFileExtension(id, QueryFileExtension),
  );
}
