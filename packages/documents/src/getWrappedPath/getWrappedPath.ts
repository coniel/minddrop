import { Fs } from '@minddrop/file-system';
import { isWrapped } from '../utils';

/**
 * Returns the wrapped version of the given document path.
 * If the document is already wrapped, the given path is returned.
 *
 * @param path The document path.
 * @returns The wrapped document path.
 */
export function getWrappedPath(path: string): string {
  // If the document is already wrapped, return the given path
  if (isWrapped(path)) {
    return path;
  }

  // Remove '.md' file extension to get desired wrapper dir path
  const wrapperDirPath = path.slice(0, -3);

  // Crate the wrapped path
  return Fs.concatPath(wrapperDirPath, Fs.fileNameFromPath(path));
}
