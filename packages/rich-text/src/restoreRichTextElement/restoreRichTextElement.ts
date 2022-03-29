import { Core } from '@minddrop/core';
import { FieldValue } from '@minddrop/utils';
import { RichTextElement } from '../types';
import { updateRichTextElement } from '../updateRichTextElement';

/**
 * Restores a rich text element and dispatches a
 * `rich-text-elements:restore` event. Returns the restored
 * element.
 *
 * - Throws a `RichTextElementNotFoundError` if the element
 *   does not exist.
 *
 * @param core A MindDrop core instance.
 * @param elementId The ID of the element to restore.
 * @returns The restored element.
 */
export function restoreRichTextElement<
  TElement extends RichTextElement = RichTextElement,
>(core: Core, elementId: string): TElement {
  // Restore the element by removing the `deleted` and `deletedAt` properties
  const restoredElement = updateRichTextElement<TElement>(core, elementId, {
    deleted: FieldValue.delete(),
    deletedAt: FieldValue.delete(),
  });

  // Dispatch 'rich-text-elements:restore' event
  core.dispatch('rich-text-elements:restore', restoredElement);

  // Return the restored element
  return restoredElement;
}
