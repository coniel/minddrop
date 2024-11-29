import { FileNotFoundError, Fs } from '@minddrop/file-system';
import { DocumentNotFoundError } from '../errors';
import { getDocument } from '../getDocument';
import { DocumentsStore } from '../DocumentsStore';
import { Events } from '@minddrop/events';
import { isWrapped } from '../utils';
import { removeChildDocuments } from '../removeChildDocuments';

/**
 * Deletes a document and its children (recursively) from the
 * store and moves the document file to system trash. If the
 * document is wrapped, moves the entire wrapper directory to
 * system trash.
 *
 * @param id - The ID of the document to delete.
 *
 * @dispatches documents:document:deleted
 */
export async function deleteDocument(id: string): Promise<void> {
  // Get the document from the store
  const document = getDocument(id);

  // Ensure that the document exists
  if (!document) {
    throw new DocumentNotFoundError(id);
  }

  // If document is wrapped, delete the wrapper directory
  const path = document?.path;
  const pathToDelete = isWrapped(path) ? Fs.parentDirPath(path) : path;

  // Ensure that the document file exists
  if (!(await Fs.exists(path))) {
    throw new FileNotFoundError(path);
  }

  // Remove the document from the store
  DocumentsStore.getState().remove(id);

  // Remove any child documents from the store
  removeChildDocuments(document.path);

  // Move the document file/directory to system trash.
  // Any child documents will also be moved to trash as
  // they are located within the wrapper directory.
  await Fs.trashFile(pathToDelete);

  // Dispatch a 'documents:document:delete' event
  Events.dispatch('documents:document:delete', id);
}
