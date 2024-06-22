import { Events } from '@minddrop/events';
import {
  FileNotFoundError,
  Fs,
  PathConflictError,
} from '@minddrop/file-system';
import { Markdown } from '@minddrop/markdown';
import { DocumentsStore } from '../DocumentsStore';
import { DocumentNotFoundError } from '../errors';
import { getDocument } from '../getDocument';
import { Document } from '../types';
import { isWrapped } from '../utils';
import { updateChildDocumentPaths } from '../updateChildDocumentPaths';
import { updateDocumentContent } from '../updateDocumentContent';

/**
 * Renames a document and its file.
 *
 * @param path The path of the document to rename.
 * @param name The new name of the document.
 * @returns The updated document.
 * @dispatches 'documents:document:renamed'
 *
 * @throws {DocumentNotFoundError} If the document does not exist.
 * @throws {FileNotFoundError} If the document file does not exist.
 * @throws {PathConflictError} If a document with the same name already exists.
 */
export async function renameDocument(path: string, name: string): Promise<Document> {
  // Get the document from the store
  const document = getDocument(path);
  // The path of the renamed document file
  const renamedFilePath = Fs.concatPath(Fs.parentDirPath(path), `${name}.md`);
  // The path of the renamed wrapper dir (only applicable if
  // the document is wrapped).
  const renamedWrapperDir = Fs.concatPath(Fs.pathSlice(path, 0, -2), name);
  // The new full path of the document
  const newPath = isWrapped(path)
    ? Fs.concatPath(renamedWrapperDir, `${name}.md`)
    : renamedFilePath;

  // Ensure the document exists
  if (!document) {
    throw new DocumentNotFoundError(path);
  }

  // Ensure the document file exists
  if (!(await Fs.exists(path))) {
    throw new FileNotFoundError(path);
  }

  // Ensure that there is not already a document with the same name
  if (await Fs.exists(newPath)) {
    throw new PathConflictError(path);
  }

  // Update the markdown heading to the new name
  const newContent = Markdown.updateHeading(document.contentRaw, name);

  // Generate the updated document object
  const updatedDocument = {
    ...document,
    path: newPath,
    title: name,
    contentRaw: newContent,
  };

  // Update the document markdown with the new heading
  await updateDocumentContent(path, newContent);

  // Update the document in the store
  DocumentsStore.getState().update(path, updatedDocument);

  // If the document is wrapped, recursively update its children's paths
  updateChildDocumentPaths(path, renamedWrapperDir);

  // Rename the document file
  await Fs.rename(path, renamedFilePath);

  // If the document is wrapped, rename the wrapper dir
  if (isWrapped(path)) {
    await Fs.rename(Fs.parentDirPath(path), renamedWrapperDir);
  }

  // Dispatch a 'documents:document:renamed' event
  Events.dispatch('documents:document:renamed', {
    oldPath: path,
    newPath,
  });

  return updatedDocument;
}
