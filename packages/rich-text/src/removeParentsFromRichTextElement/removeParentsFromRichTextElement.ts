import { Core, ParentReference } from '@minddrop/core';
import { FieldValue } from '@minddrop/utils';
import { RichTextElement } from '../types';
import { updateRichTextElement } from '../updateRichTextElement';

/**
 * Removes parent references from a rich text element and dispatches
 * a `rich-text-elements:remove-parents` event.
 *
 * - Throws a `RichTextElementNotFoundError` if the rich text element
 *   does not exist.
 *
 * @param core A MindDrop core instance.
 * @param elementId The ID of the element from which to remove the parents.
 * @param parents The parent references to remove from the element.
 * @returns The updated element.
 */
export function removeParentsFromRichTextElement<
  TElement extends RichTextElement = RichTextElement,
>(core: Core, elementId: string, parents: ParentReference[]): TElement {
  // Remove the parents from the element
  const element = updateRichTextElement<TElement>(core, elementId, {
    parents: FieldValue.arrayRemove(parents),
  });

  // Dispatch a 'rich-text-elements:remove-parents' event
  core.dispatch('rich-text-elements:remove-parents', { element, parents });

  // Return the updated element
  return element;
}
