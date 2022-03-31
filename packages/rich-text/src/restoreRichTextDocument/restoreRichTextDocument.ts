import { Core } from '@minddrop/core';
import { FieldValue } from '@minddrop/utils';
import { RichTextDocument } from '../types';
import { updateRichTextDocument } from '../updateRichTextDocument';

/**
 * Restores a deleted rich text document and dispatches a
 * `rich-text-documents:restore` event. Returns the restored
 * document.
 *
 * @param core A MindDrop core instance.
 * @param documentId The ID of the rich text document to restore.
 * @returns The restored document.
 */
export function restoreRichTextDocument(
  core: Core,
  documentId: string,
): RichTextDocument {
  // Update the document, removing `deleted` and `deletedAt`
  const document = updateRichTextDocument(core, documentId, {
    deleted: FieldValue.delete(),
    deletedAt: FieldValue.delete(),
  });

  // Dispatch a 'rich-text-documents:restore' event
  core.dispatch('rich-text-documents:restore', document);

  // Return the restored document
  return document;
}
