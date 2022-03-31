import { Core } from '@minddrop/core';
import { RichTextDocument } from '../types';
import { updateRichTextDocument } from '../updateRichTextDocument';

/**
 * Deletes a rich text document and dispatches a
 * `rich-text-documents:delete` event. Returns the updated
 * document.
 *
 * @param core A MindDrop core instance.
 * @param documentId The ID of the document to delete.
 * @returns The updated document.
 */
export function deleteRichTextDocument(
  core: Core,
  documentId: string,
): RichTextDocument {
  // Update the document, adding `deleted` and `deletedAt`
  const document = updateRichTextDocument(core, documentId, {
    deleted: true,
    deletedAt: new Date(),
  });

  // Dispatch a 'rich-text-documents:delete' event
  core.dispatch('rich-text-documents:delete', document);

  // Return the updated document
  return document;
}
