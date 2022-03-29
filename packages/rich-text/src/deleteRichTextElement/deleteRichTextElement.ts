import { Core } from '@minddrop/core';
import { RichTextElement } from '../types';
import { updateRichTextElement } from '../updateRichTextElement';

/**
 * Deletes a rich text element and dispatches a
 * `rich-text-elements:delete` event.
 *
 * - Throws a `RichTextElementNotFoundError` if the element
 *   does not exist.
 *
 * @param core A MindDrop core instance.
 * @param elementId The ID of the element to delete.
 */
export function deleteRichTextElement<
  TElement extends RichTextElement = RichTextElement,
>(core: Core, elementId: string): TElement {
  // Mark the element as deleted
  const deleted = updateRichTextElement<TElement>(core, elementId, {
    deleted: true,
    deletedAt: new Date(),
  });

  // Dispatch a 'rich-text-elements:delete' event
  core.dispatch('rich-text-elements:delete', deleted);

  // Return the deleted element
  return deleted;
}
