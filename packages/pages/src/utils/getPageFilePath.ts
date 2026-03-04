import { Fs } from '@minddrop/file-system';
import { PageFileExtension } from '../constants';
import { getPagesDirPath } from './getPagesDirPath';

/**
 * Returns the path to a page file.
 *
 * @param id - The ID of the page.
 * @returns The path to the page file.
 */
export function getPageFilePath(id: string) {
  return Fs.concatPath(
    getPagesDirPath(),
    Fs.addFileExtension(id, PageFileExtension),
  );
}
