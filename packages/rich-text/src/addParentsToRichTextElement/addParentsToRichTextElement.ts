import { Core, ParentReference, ParentReferences } from '@minddrop/core';
import { FieldValue } from '@minddrop/utils';
import { RichTextElement } from '../types';
import { updateRichTextElement } from '../updateRichTextElement';

/**
 * Adds parent references to a rich text element and dispatches a
 * `rich-text-elements:add-parents` event. Returns the updated
 * element.
 *
 * - Throws a `RichTextElementNotFound` error if the element does
 *   not exist.
 * - Throws a `ParentReferenceValidationError` if any of the parent
 *   references are invalid.
 *
 * @param core A MindDrop core instance.
 * @param elementId The ID of the element to which to add the parents.
 * @param parents The references of the parents to add.
 * @returns The updated rich text element.
 */
export function addParentsToRichTextElement<
  TElement extends RichTextElement = RichTextElement,
>(core: Core, elementId: string, parents: ParentReference[]): TElement {
  // Validate the parent references
  ParentReferences.validate(parents);

  // Add the parent references to the element
  const element = updateRichTextElement<TElement>(core, elementId, {
    parents: FieldValue.arrayUnion(parents),
  });

  // Dispatch a 'rich-text-elements:add-parents' event
  core.dispatch('rich-text-elements:add-parents', { element, parents });

  // Return the updated element
  return element;
}
