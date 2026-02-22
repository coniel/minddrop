import { Fs } from '@minddrop/file-system';
import { ViewFileExtension } from '../constants';
import { getViewsDirPath } from './getViewsDirPath';

/**
 * Returns the path to a view file.
 *
 * @param id - The ID of the view.
 * @returns The path to the view file.
 */
export function getViewFilePath(id: string): string {
  return Fs.concatPath(
    getViewsDirPath(),
    Fs.addFileExtension(id, ViewFileExtension),
  );
}
