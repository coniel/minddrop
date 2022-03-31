import { Core } from '@minddrop/core';
import { getRichTextDocument } from '../getRichTextDocument';
import { RichTextDocument } from '../types';
import { useRichTextStore } from '../useRichTextStore';

/**
 * Permanently deletes a rich text document and dispatches a
 * `rich-text-documents:delete-permanently` event. Returns the
 * deleted document.
 *
 * - Throws a `RichTextDocumentNotFoundError` if the document
 *   does not exist.
 *
 * @param core A MindDrop core instance.
 * @param documentId The ID of the docuemnt to permanently delete.
 * @returns The deleted docuemnt.
 */
export function permanentlyDeleteRichTextDocument(
  core: Core,
  documentId: string,
): RichTextDocument {
  // Get the document
  const document = getRichTextDocument(documentId);

  // Remove the document from the store
  useRichTextStore.getState().removeDocument(document.id);

  // Dispatch a 'rich-text-documents:delete-permanently' event
  core.dispatch('rich-text-documents:delete-permanently', document);

  // Return the deleted document
  return document;
}
