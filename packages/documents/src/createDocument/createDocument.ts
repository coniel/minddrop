import { Events } from '@minddrop/events';
import { DocumentsStore } from '../DocumentsStore';
import { DefaultDocumentProperties } from '../constants';
import { createDocumentFile } from '../createDocumentFile';
import { Document } from '../types';
import { getDocumentTypeConfig } from '../DocumentTypeConfigsStore';

/**
 * Create a document and its associated file.
 * Dispatches a 'documents:document:create' event.
 *
 * @param parentDir - The path to the parent directory.
 * @param type - The document file type.
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
  type: string,
  title: string,
  options: { wrap?: boolean } = {},
): Promise<Document> {
  // Get the config for the document type
  const config = getDocumentTypeConfig(type);
  // Initialize the document content
  const { content, properties } = config.initialize(title);
  // Add the default icon to the config's default properties
  const defaultProperties = { ...DefaultDocumentProperties, ...properties };
  // Create the stringified file content
  const fileTextContent = config.stringify(defaultProperties, content);

  // Create document file
  const documentFilePath = await createDocumentFile(
    parentDir,
    title,
    config.fileType,
    fileTextContent,
    options,
  );

  // Create document object
  const document: Document = {
    title,
    fileType: type,
    path: documentFilePath,
    properties: defaultProperties,
    wrapped: !!options.wrap,
    fileTextContent,
    content,
  };

  // Add document to the store
  DocumentsStore.getState().add(document);

  // Dispatch 'documents:document:create' event
  Events.dispatch('documents:document:create', document);

  return document;
}
