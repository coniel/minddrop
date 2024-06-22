import { FileNotFoundError, Fs } from '@minddrop/file-system';
import { DocumentNotFoundError } from '../errors';
import { getDocument } from '../getDocument';
import { DocumentsStore } from '../DocumentsStore';
import { Events } from '@minddrop/events';
import { isWrapped } from '../utils';
import { removeChildDocuments } from '../removeChildDocuments';

/**
 * Deletes a document from the store and moves the document
 * file to system trash. If the document is wrapped, moves
 * the entire wrapper directory to system trash.
 *
 * Dispatches a 'documents:document:deleted' event.
 *
 * @param path - The path of the document to delete.
 *
 * @dispatches 'documents:document:deleted'
 */
export async function deleteDocument(path: string): Promise<void> {
  // If document is wrapped, delete the wrapper directory
  const pathToDelete = isWrapped(path) ? Fs.parentDirPath(path) : path;

  // Ensure that the document exists
  if (!getDocument(path)) {
    throw new DocumentNotFoundError(path);
  }

  // Ensure that the document file exists
  if (!(await Fs.exists(path))) {
    throw new FileNotFoundError(path);
  }

  // Remove the document from the store
  DocumentsStore.getState().remove(path);

  // If the document is wrapped, remove its children from the store
  if (isWrapped(path)) {
    removeChildDocuments(path);
  }

  // Move the document file to system trash
  await Fs.trashFile(pathToDelete);

  // Dispatch a 'documents:document:delete' event
  Events.dispatch('documents:document:delete', path);
}
