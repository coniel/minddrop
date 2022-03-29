import { Core } from '@minddrop/core';
import { getRichTextElement } from '../getRichTextElement';
import { RichTextElement } from '../types';
import { useRichTextStore } from '../useRichTextStore';

/**
 * Permanently deletes a rich text element and dispatches a
 * `rich-text-elements:delete-permanently` event. Returns the
 * permanently deleted element.
 *
 * - Trhows a `RichTextElementNotFoundError` if the element
 *   does not exist.
 *
 * @param core A MindDrop core instance.
 * @param elementId The ID of the element to permanently delete.
 * @returns The permanently deleted element.
 */
export function permanentlyDeleteRichTextElement<
  TElement extends RichTextElement = RichTextElement,
>(core: Core, elementId: string): TElement {
  // Get the element
  const element = getRichTextElement<TElement>(elementId);

  // Remove the element from the rich text store
  useRichTextStore.getState().removeElement(elementId);

  // Dispatch a 'rich-text-elements:delete-permanently' event
  core.dispatch('rich-text-elements:delete-permanently', element);

  // Return the element
  return element;
}
