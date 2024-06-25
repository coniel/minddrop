import {
  Fs,
  FileNotFoundError,
  PathConflictError,
} from '@minddrop/file-system';
import { DocumentsStore } from '../DocumentsStore';

/**
 * Wraps a document in a directory of the same name.
 *
 * @param path - The document path.
 * @returns The new document path.
 */
export async function wrapDocument(path: string): Promise<string> {
  // Remove document file extension to get desired
  // wrapper dir path.
  const wrapperDirPath = Fs.removeExtension(path);
  // Create the final wrapped path
  const wrappedPath = Fs.concatPath(wrapperDirPath, Fs.fileNameFromPath(path));

  // Ensure that document file exists
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

  // Move document file to wrapper dir
  await Fs.rename(path, wrappedPath);

  // Update the document in the store
  DocumentsStore.getState().update(path, { path: wrappedPath, wrapped: true });

  // Return new document path
  return wrappedPath;
}
