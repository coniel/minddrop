import { FileNotFoundError, Fs } from '@minddrop/file-system';
import { Events } from '@minddrop/events';
import { getDocumentTypeConfig } from '../DocumentTypeConfigsStore';
import { DocumentNotFoundError } from '../errors';
import { getDocument } from '../getDocument';
import { Document } from '../types';
import { DocumentsStore } from '../DocumentsStore';
import { writeDocument } from '../writeDocument';

/**
 * Updates a document with the given data via a shallow merge.
 * The document is updated in the store and changes are written
 * to the file.
 *
 * @param path - The path of the document to update.
 * @param updateData - The data to update the document with.
 * @returns The updated document.
 *
 * @throws {DocumentNotFoundError} - If the document does not exist.
 * @throws {FileNotFoundError} - If the document file does not exist.
 * @throws {DocumentTypeConfigNotFoundError} - If the document type is not reigstered.
 * @dispatches 'documents:document:update'
 */
export async function updateDocument(
  path: string,
  updateData: Partial<Document>,
): Promise<Document> {
  // Get the document from the store
  const document = getDocument(path);

  // Ensure the document exists
  if (!document) {
    throw new DocumentNotFoundError(path);
  }

  // Ensure the document file exists
  if (!(await Fs.exists(path))) {
    throw new FileNotFoundError(path);
  }

  // Get the document type config
  const config = getDocumentTypeConfig(document.fileType);

  // Merge the new properties with the existing properties
  const updatedDocument: Document = {
    ...document,
    ...updateData,
  };

  // Content is only parsed when a document is opened
  // and so so it may not be present, but we need it to
  // regenerate the file text content.
  const content =
    updatedDocument.content ||
    config.parseContent(updatedDocument.fileTextContent);

  // Regenerate the file text content
  updatedDocument.fileTextContent = config.stringify(
    updatedDocument.properties,
    content,
  );

  // Update the document in the store
  DocumentsStore.getState().update(document.path, updatedDocument);

  // Write updated document to file
  await writeDocument(path, updatedDocument.fileTextContent);

  // Dispatch a `documents:document:update` event
  Events.dispatch('documents:document:update', updatedDocument);

  return updatedDocument;
}
