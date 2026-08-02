import { Fs } from '@minddrop/file-system';
import { ViewFileExtension } from '../constants';
import { getViewsDirPath } from './getViewsDirPath';

/**
 * Returns the path to a data view file.
 *
 * @param id - The ID of the data view.
 * @returns The path to the data view file.
 */
export function getViewFilePath(id: string): string {
  return Fs.concatPath(
    getViewsDirPath(),
    Fs.addFileExtension(id, ViewFileExtension),
  );
}
