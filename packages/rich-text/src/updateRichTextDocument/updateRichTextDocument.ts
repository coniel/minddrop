import { Core } from '@minddrop/core';
import { createUpdate } from '@minddrop/utils';
import { getRichTextDocument } from '../getRichTextDocument';
import { RichTextDocument, RichTextDocumentChanges } from '../types';
import { useRichTextStore } from '../useRichTextStore';
import { validateRichTextDocument } from '../validateRichTextDocument';

/**
 * Updates a rich text document and dispatches a
 * `rich-text-documents:update' event. Returns the updated document.
 *
 * - Throws a `RichTextDocumentNotFoundError` if the document does
 *   not exist.
 * - Throws a `ParentReferenceValidationError` if any of the parent
 *   references are invalid.
 * - Throws a `RichTextElementNotFoundError` if any of the child
 *   elements do not exist.
 * - Throws a `RichTextElementTypeNotRegisteredError` if any of the
 *   child elements are not of a registered type.
 * - Throws a `RichTextDocumentValidationError` if there are any other
 *   validation errors.
 *
 * @param core A MindDrop core instance.
 * @param documentId The ID of the rich text document to update.
 * @param data The update data.
 * @returns The updated docuemnt.
 */
export function updateRichTextDocument(
  core: Core,
  documentId: string,
  data: Partial<RichTextDocumentChanges>,
): RichTextDocument {
  // Get the document
  const document = getRichTextDocument(documentId);

  // Create an update object
  const update = createUpdate(document, data, { setUpdatedAt: true });

  // Validate the updated document
  validateRichTextDocument(update.after);

  // Update the document in the store
  useRichTextStore.getState().setDocument(update.after);

  // Dispatch a 'rich-text-documents:update' event
  core.dispatch('rich-text-documents:update', update);

  // Return the updated document
  return update.after;
}
