import { Core, ParentReferences } from '@minddrop/core';
import { FieldValue } from '@minddrop/utils';
import { addParentsToRichTextElement } from '../addParentsToRichTextElement';
import { RichTextBlockElement } from '../types';
import { updateRichTextElement } from '../updateRichTextElement';

/**
 * Nests rich text block elements into another rich text
 * block element and dispatches a `rich-text-elements:nest`
 * event. Returns the updated element.
 *
 * - Throws a `RichTextElementNotFoundError` if the element
 *   does not exist.
 * - Throws a `RichTextElementValidationError` if the element
 *   is not a block level element.
 * - Throws a `RichTextElementValidationError` if any of the
 *   nested elements do not exist or are not block level
 *   elements.
 *
 * @param core A MindDrop core instance.
 * @param elementId The ID of the element into which to nest elements.
 * @param nestElementIds The IDs of the elements to nest.
 * @returns The updated element.
 */
export function nestRichTextElements<
  TElement extends RichTextBlockElement = RichTextBlockElement,
>(core: Core, elementId: string, nestElementIds: string[]): TElement {
  // Add the nested element IDs to the element
  const element = updateRichTextElement<TElement>(core, elementId, {
    nestedElements: FieldValue.arrayUnion(nestElementIds),
  });

  // Create a parent reference
  const parentReference = ParentReferences.generate(
    'rich-text-element',
    elementId,
  );

  // Add the element as a parent on the nested elements
  nestElementIds.forEach((id) => {
    addParentsToRichTextElement(core, id, [parentReference]);
  });

  // Dispatch a 'rich-text-elements:nest' event
  core.dispatch('rich-text-elements:nest', {
    element,
    nestedElements: nestElementIds,
  });

  // Return the updated element
  return element;
}
