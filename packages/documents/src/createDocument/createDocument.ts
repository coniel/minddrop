import { Events } from '@minddrop/events';
import { uuid } from '@minddrop/utils';
import { DocumentsStore } from '../DocumentsStore';
import { createDocumentFile } from '../createDocumentFile';
import { Document, SerializableDocumentData } from '../types';

/**
 * Create a document and its associated file.
 *
 * @param parentDir - The path to the parent directory.
 * @param title - The document title.
 * @param options - File creation options.
 * @param options.wrap - Whether the document should be wrapped in a directory of the same name.
 * @returns The new document.
 *
 * @dispatches documents:document:create
 *
 * @throws {InvalidPathError} - The parent dir does not exist.
 * @throws {PathConflictError} - Document or wrapper dir already exists.
 */
export async function createDocument(
  parentDir: string,
  title: string,
  options: { wrap?: boolean } = {},
): Promise<Document> {
  const documentData: SerializableDocumentData = {
    id: uuid(),
    created: new Date(),
    lastModified: new Date(),
    title,
    blocks: [],
    views: [],
  };

  // Create document file
  const documentFilePath = await createDocumentFile(
    parentDir,
    title,
    JSON.stringify(documentData),
    options,
  );

  // Add derived properties to document
  const document: Document = {
    path: documentFilePath,
    wrapped: options.wrap || false,
    ...documentData,
    blocks: [],
    views: [],
  };

  // Add document to the store
  DocumentsStore.getState().add(document);

  // Dispatch document create event
  Events.dispatch('documents:document:create', document);

  return document;
}
