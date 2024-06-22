import { Events } from '@minddrop/events';
import { DocumentsStore } from '../DocumentsStore';
import { DefaultDocumentIcon } from '../constants';
import { createDocumentFile } from '../createDocumentFile';
import { Document } from '../types';

/**
 * Create a document and its associated markdown file.
 * Dispatches a 'documents:document:create' event.
 *
 * @param parentDir - The path to the parent directory.
 * @param title - The document title.
 * @param options - File creation options.
 * @param options.wrap - Whether the document should be wrapped in a directory of the same name.
 * @returns The new document.
 *
 * @throws {InvalidPathError} - The parent dir does not exist.
 * @throws {PathConflictError} - Document or wrapper dir already exists.
 */
export async function createDocument(
  parentDir: string,
  title: string,
  options: { wrap?: boolean } = {},
): Promise<Document> {
  // Create document file
  const documentFilePath = await createDocumentFile(parentDir, title, options);

  // Create document object
  const document: Document = {
    title,
    path: documentFilePath,
    icon: DefaultDocumentIcon,
    wrapped: !!options.wrap,
    contentRaw: '',
    contentParsed: null,
  };

  // Add document to the store
  DocumentsStore.getState().add(document);

  // Dispatch 'documents:document:create' event
  Events.dispatch('documents:document:create', document);

  return document;
}
