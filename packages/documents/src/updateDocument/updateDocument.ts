import { Events } from '@minddrop/events';
import { DocumentNotFoundError } from '../errors';
import { getDocument } from '../getDocument';
import { Document } from '../types';
import { DocumentsStore } from '../DocumentsStore';

/**
 * Updates a document with the given data via a shallow merge.
 * The document is updated in the store and changes are written
 * to the file.
 *
 * @param id - The id of the document to update.
 * @param updateData - The data to update the document with.
 * @param updateTimestamp - Whether to update the document's `modified` timestamp, defaults to `true`.
 * @returns The updated document.
 *
 * @throws {DocumentNotFoundError} - If the document does not exist.
 * @throws {FileNotFoundError} - If the document file does not exist.
 * @throws {DocumentTypeConfigNotFoundError} - If the document type is not reigstered.
 *
 * @dispatches documents:document:update
 */
export function updateDocument(
  id: string,
  updateData: Partial<Document>,
  updateTimestamp = true,
): Document {
  // Get the document from the store
  const document = getDocument(id);

  // Ensure the document exists
  if (!document) {
    throw new DocumentNotFoundError(id);
  }

  // Merge the new properties with the existing properties
  const updatedDocument: Document = {
    ...document,
    ...updateData,
    lastModified: updateTimestamp ? new Date() : document.lastModified,
  };

  // Update the document in the store
  DocumentsStore.getState().update(document.id, updatedDocument);

  // Dispatch a document update event
  Events.dispatch('documents:document:update', updatedDocument);

  return updatedDocument;
}
