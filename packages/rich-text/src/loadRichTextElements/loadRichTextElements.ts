import { Core } from '@minddrop/core';
import { RichTextElement } from '../types';
import { useRichTextStore } from '../useRichTextStore';

/**
 * Loads rich text elements into the store and dispatches a
 * `rich-text-elements:load` envent.
 *
 * @param core A MindDrop core instance.
 * @param elements The elements to load.
 */
export function loadRichTextElements(
  core: Core,
  elements: RichTextElement[],
): void {
  // Load the elements into the store
  useRichTextStore.getState().loadElements(elements);

  // Dispatch a 'rich-text-elements:load' event
  core.dispatch('rich-text-elements:load', elements);
}
