import { Core } from '@minddrop/core';
import { createUpdate } from '@minddrop/utils';
import { getRichTextElement } from '../getRichTextElement';
import { RichTextElement, RichTextElementChanges } from '../types';
import { useRichTextStore } from '../useRichTextStore';
import { validateRichTextElement } from '../validateRichTextElement';

/**
 * Updates a rich text element and dispatches a
 * `rich-text-elemets:update` event. Returns the updated element.
 *
 * - Throws a `RichTextElementNotFoundError` if the element does
 *   not exist.
 * - Throws a `RichTextElementTypeNotRegistered` if the element
 *   type is not registered
 * - Throws a `RichTextElementValidationError` if the updated
 *   element is invalid.
 *
 * @param core A MindDrop core instance.
 * @param elementId The ID of the element to update.
 * @param data The changes to apply to the element.
 * @returns The updated element.
 */
export function updateRichTextElement<
  TElement extends RichTextElement = RichTextElement,
  TData extends RichTextElementChanges = RichTextElementChanges,
>(core: Core, elementId: string, data: TData): TElement {
  // Get the element
  const element = getRichTextElement<TElement>(elementId);

  // Create an update using the supplied data
  const update = createUpdate(element, data);

  // Validate the updated element
  validateRichTextElement(update.after);

  // Update the element in the rich text store
  useRichTextStore.getState().setElement(update.after);

  // Dispatch a 'rich-text-elements:update' event
  core.dispatch('rich-text-elements:update', update);

  // Return the updated element
  return update.after;
}
