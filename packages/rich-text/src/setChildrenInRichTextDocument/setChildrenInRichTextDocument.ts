import { Core, ParentReferences } from '@minddrop/core';
import { addParentsToRichTextElement } from '../addParentsToRichTextElement';
import { getRichTextDocument } from '../getRichTextDocument';
import { getRichTextElements } from '../getRichTextElements';
import { removeParentsFromRichTextElement } from '../removeParentsFromRichTextElement';
import { RichTextDocument } from '../types';
import { updateRichTextDocument } from '../updateRichTextDocument';

/**
 * Sets the child elements of a rich text document and dispatches a
 * `rich-text-documents:set-children` event. Returns the updated document.
 *
 * Adds the document as a parent on any added child elements and removes
 * the document as a parent from any removed child elements.
 *
 * - Throws a `RichTextDocumentNotFoundError` if the rich text document does
 *   not exist.
 * - Throws a `RichTextElementNotFoundError` if any of the rich text block
 * - elements do not exist.
 * - Throws a `RichTextDocumentValidationError` if any of the added elements
 * - are not block level elements.
 *
 * @param core A MindDrop core instance.
 * @param documentId The ID of the document in which to set the children.
 * @param children The IDs of the document's children.
 * @returns The updated document.
 */
export function setChildrenInRichTextDocument(
  core: Core,
  documentId: string,
  children: string[],
): RichTextDocument {
  // Get the document
  const document = getRichTextDocument(documentId);
  // Get the IDs of the elements which were removed from the document
  const removedElementIds = document.children.filter(
    (id) => !children.includes(id),
  );
  // Get the IDs of the elements which were added to the document
  const addedElementIds = children.filter(
    (id) => !document.children.includes(id),
  );

  // Set the updated children in the document
  const updatedDocument = updateRichTextDocument(core, documentId, {
    children,
  });

  // Generate a parent reference for the document
  const parentReference = ParentReferences.generate(
    'rich-text-document',
    document.id,
  );

  // Remove the document as a parent from the removed elements
  removedElementIds.forEach((id) => {
    removeParentsFromRichTextElement(core, id, [parentReference]);
  });

  // Add the document as a parent to the added elements
  addedElementIds.forEach((id) => {
    addParentsToRichTextElement(core, id, [parentReference]);
  });

  // Get the updated removed elements
  const removedElements = getRichTextElements(removedElementIds);
  // Get the updated added elements
  const addedElements = getRichTextElements(addedElementIds);

  // Dispatch a 'rich-text-documents:set-children' event
  core.dispatch('rich-text-documents:set-children', {
    document: updatedDocument,
    removedElements,
    addedElements,
  });

  // Return the updated document
  return updatedDocument;
}
