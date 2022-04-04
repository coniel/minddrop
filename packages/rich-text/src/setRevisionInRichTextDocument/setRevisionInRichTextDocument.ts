import { Core } from '@minddrop/core';
import { RichTextDocument } from '../types';
import { updateRichTextDocument } from '../updateRichTextDocument';

/**
 * Sets a new reivsion on the document and dispaches a
 * `rich-text-documents:update` event. Returns the updated document.
 *
 * - Throws a `RichTextDocumentNotFoundError` if the rich text
 *   document does not exist.
 *
 * @param core A MindDrop core instance.
 * @param documentId The ID of the document for which to set the revision.
 * @param revision The new revision ID to set.
 */
export function setRevisionInRichTextDocument(
  core: Core,
  documentId: string,
  revision: string,
): RichTextDocument {
  // Update the document, setting the new revision
  return updateRichTextDocument(core, documentId, { revision });
}
