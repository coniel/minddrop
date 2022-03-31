import { Core, ParentReferences } from '@minddrop/core';
import { addParentsToRichTextElement } from '../addParentsToRichTextElement';
import { RichTextDocumentValidationError } from '../errors';
import { generateRichTextDocument } from '../generateRichTextDocument';
import { CreateRichTextDocumentData, RichTextDocument } from '../types';
import { useRichTextStore } from '../useRichTextStore';
import { validateRichTextDocument } from '../validateRichTextDocument';

/**
 * Creates a new rich text document and dispatches a
 * `rich-text-documents:create' event. Returns the newly created document.
 *
 * Adds the document as a parent on all rich text block elements listen in
 * `children`.
 *
 * - Throws a `RichTextElementTypeNotRegistered` error if any of the child
 *   element types are not registered.
 * - Throws a `RichTextElementNotFoundError` if any of the children do not
 *   exist.
 * - Throws a `RichTextDocumentValidationError` if any of the children are
 *   not block level rich text elements.
 *
 * @param core A MindDrop core instance.
 * @param data The document data.
 * @returns The newly created document.
 */
export function createRichTextDocument(
  core: Core,
  data: CreateRichTextDocumentData = {},
): RichTextDocument {
  // Throw an error if the data contains the `parents` property
  if ('parents' in data) {
    throw new RichTextDocumentValidationError(
      'creating a rich text document with a `parents` property is forbidden, parents must be added after creation',
    );
  }

  // Generate a new rich text document
  const document = generateRichTextDocument(data);

  // Validate the document
  validateRichTextDocument(document);

  // Add the document to the rich text store
  useRichTextStore.getState().setDocument(document);

  // Generate a parent reference
  const parentReference = ParentReferences.generate(
    'rich-text-document',
    document.id,
  );

  // Add the document as a parent on its child elements
  document.children.forEach((id) => {
    addParentsToRichTextElement(core, id, [parentReference]);
  });

  // Dispatch a 'rich-text-documents:create' event
  core.dispatch('rich-text-documents:create', document);

  // Return the new document
  return document;
}
