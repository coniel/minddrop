import { Events } from '@minddrop/events';
import {
  FileNotFoundError,
  Fs,
  PathConflictError,
} from '@minddrop/file-system';
import { DocumentsStore } from '../DocumentsStore';
import { DocumentNotFoundError } from '../errors';
import { getDocument } from '../getDocument';
import { Document } from '../types';
import { updateChildDocumentPaths } from '../updateChildDocumentPaths';
import { isWrapped } from '../utils';

/**
 * Renames a document and its file.
 *
 * @param id - The id of the document to rename.
 * @param name - The new name of the document.
 * @returns The updated document.
 * @dispatches 'documents:document:rename'
 *
 * @throws {DocumentNotFoundError} - If the document does not exist.
 * @throws {FileNotFoundError} - If the document file does not exist.
 * @throws {DocumentTypeConfigNotFoundError} - If the document type is not reigstered.
 * @throws {PathConflictError} - If a document with the same name already exists.
 */
export async function renameDocument(
  id: string,
  name: string,
): Promise<Document> {
  // Get the document from the store
  const document = getDocument(id);

  // Ensure the document exists
  if (!document) {
    throw new DocumentNotFoundError(id);
  }

  const { path } = document;

  // Generate the new file name
  const newFileName = `${name}.minddrop`;
  // Concat new file name to the parent dir path
  const renamedFilePath = Fs.concatPath(Fs.parentDirPath(path), newFileName);
  // The path of the renamed wrapper dir (only applicable if
  // the document is wrapped).
  const renamedWrapperDir = Fs.concatPath(Fs.pathSlice(path, 0, -2), name);
  // The new full path of the document
  const newPath = isWrapped(path)
    ? Fs.concatPath(renamedWrapperDir, newFileName)
    : renamedFilePath;

  // Ensure the document file exists
  if (!(await Fs.exists(path))) {
    throw new FileNotFoundError(path);
  }

  // Ensure that there is not already a document with the same name
  if (await Fs.exists(newPath)) {
    throw new PathConflictError(path);
  }

  // Rename the document file
  await Fs.rename(path, renamedFilePath);

  // If the document is wrapped, rename the wrapper dir
  if (isWrapped(path)) {
    await Fs.rename(Fs.parentDirPath(path), renamedWrapperDir);
  }

  // Update the document's path and title in the store
  const updatedData = {
    path: newPath,
    title: name,
  };

  DocumentsStore.getState().update(id, updatedData);

  // If the document is wrapped, recursively update its children's paths
  updateChildDocumentPaths(document.path, renamedWrapperDir);

  // Dispatch a 'documents:document:rename' event
  Events.dispatch('documents:document:rename', {
    oldPath: path,
    newPath,
  });

  // Return the updated document
  return { ...document, ...updatedData };
}
