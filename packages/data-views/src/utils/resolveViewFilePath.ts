import { Fs } from '@minddrop/file-system';
import { ViewFileExtension } from '../constants';
import { resolveViewsDirPath } from './resolveViewsDirPath';

/**
 * Returns the path to a data view file.
 *
 * @param id - The ID of the data view.
 * @returns The path to the data view file.
 */
export function resolveViewFilePath(id: string): string {
  return Fs.concatPath(
    resolveViewsDirPath(),
    Fs.addFileExtension(id, ViewFileExtension),
  );
}
