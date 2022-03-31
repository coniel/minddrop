import { Core, ParentReference } from '@minddrop/core';
import { FieldValue } from '@minddrop/utils';
import { RichTextDocument } from '../types';
import { updateRichTextDocument } from '../updateRichTextDocument';

/**
 * Removes parent references from a rich text document and dispatches
 * a `rich-text-documents:remove-parents` event.
 *
 * - Throws a `RichTextDocumentNotFoundError` if the rich text document
 *   does not exist.
 *
 * @param core A MindDrop core instance.
 * @param documentId The ID of the document from which to remove the parents.
 * @param parents The parent references to remove from the document.
 * @returns The updated document.
 */
export function removeParentsFromRichTextDocument(
  core: Core,
  documentId: string,
  parents: ParentReference[],
): RichTextDocument {
  // Remove the parents from the document
  const document = updateRichTextDocument(core, documentId, {
    parents: FieldValue.arrayRemove(parents),
  });

  // Dispatch a 'rich-text-documents:remove-parents' event
  core.dispatch('rich-text-documents:remove-parents', { document, parents });

  // Return the updated document
  return document;
}
