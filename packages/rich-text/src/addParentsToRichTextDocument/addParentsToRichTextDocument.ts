import { Core, ParentReference, ParentReferences } from '@minddrop/core';
import { FieldValue } from '@minddrop/utils';
import { RichTextDocument } from '../types';
import { updateRichTextDocument } from '../updateRichTextDocument';

/**
 * Adds parent references to a rich text document and dispatches a
 * `rich-text-documents:add-parents` event. Returns the updated
 * document.
 *
 * - Throws a `RichTextDocumentNotFound` error if the document does
 *   not exist.
 * - Throws a `ParentReferenceValidationError` if any of the parent
 *   references are invalid.
 *
 * @param core A MindDrop core instance.
 * @param documentId The ID of the document to which to add the parents.
 * @param parents The references of the parents to add.
 * @returns The updated rich text document.
 */
export function addParentsToRichTextDocument(
  core: Core,
  documentId: string,
  parents: ParentReference[],
): RichTextDocument {
  // Validate the parent references
  ParentReferences.validate(parents);

  // Add the parent references to the document
  const document = updateRichTextDocument(core, documentId, {
    parents: FieldValue.arrayUnion(parents),
  });

  // Dispatch a 'rich-text-documents:add-parents' event
  core.dispatch('rich-text-documents:add-parents', { document, parents });

  // Return the updated document
  return document;
}
