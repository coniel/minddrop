import {
  Fs,
  FileNotFoundError,
  PathConflictError,
} from '@minddrop/file-system';
import { PagesStore } from '../PagesStore';

/**
 * Wraps a page in a directory of the same name.
 *
 * @param path - The page path.
 * @returns The new page path.
 */
export async function wrapPage(path: string): Promise<string> {
  // Remove '.md' file extension to get desired
  // wrapper dir path.
  const wrapperDirPath = path.slice(0, -3);
  // Create the final wrapped path
  const wrappedPath = Fs.concatPath(wrapperDirPath, Fs.fileNameFromPath(path));

  // Ensure that page file exists
  if (!(await Fs.exists(path))) {
    throw new FileNotFoundError(path);
  }

  // Ensure that desired wrapper dir does not
  // already exist.
  if (await Fs.exists(wrapperDirPath)) {
    throw new PathConflictError(wrapperDirPath);
  }

  // Create wrapper dir
  await Fs.createDir(wrapperDirPath);

  // Move page file to wrapper dir
  await Fs.rename(path, wrappedPath);

  // Update the page in the store
  PagesStore.getState().update(path, { path: wrappedPath, wrapped: true });

  // Return new page path
  return wrappedPath;
}
