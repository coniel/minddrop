import { Fs } from '@minddrop/file-system';
import { ViewFileExtension } from '../../constants';
import { resolveViewsDirPath } from '../resolveViewsDirPath';

/**
 * Returns the ID of the data view stored at the given path, or null
 * if the path is not a data view file. View files are named by their
 * ID.
 *
 * @param path - The path to resolve.
 * @returns The data view ID or null if the path is not a view file.
 */
export function resolveDataViewId(path: string): string | null {
  const parentDirPath = Fs.parentDirPath(path);

  // View files sit directly in the active workspace's views directory
  if (parentDirPath !== resolveViewsDirPath()) {
    return null;
  }

  const fileName = Fs.fileNameFromPath(path);

  // Ignore other files that may end up in the directory
  if (Fs.getExtension(fileName) !== ViewFileExtension) {
    return null;
  }

  return Fs.removeExtension(fileName);
}
