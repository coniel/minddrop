import {
  Fs,
  FileNotFoundError,
  PathConflictError,
} from '@minddrop/file-system';
import { Events } from '@minddrop/events';
import { DocumentsStore } from '../DocumentsStore';
import { getDocument } from '../getDocument';
import { DocumentNotFoundError } from '../errors';

/**
 * Wraps a document in a directory of the same name.
 *
 * @param id - The document id.
 * @returns The new document path.
 */
export async function wrapDocument(id: string): Promise<string> {
  const document = getDocument(id);

  // Ensure the document exists
  if (!document) {
    throw new DocumentNotFoundError(id);
  }

  const { path } = document;

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
  DocumentsStore.getState().update(id, { path: wrappedPath, wrapped: true });

  // Dispatch document wrapped event
  Events.dispatch('documents:document:wrap', {
    oldPath: path,
    newPath: wrappedPath,
  });

  // Return new document path
  return wrappedPath;
}
