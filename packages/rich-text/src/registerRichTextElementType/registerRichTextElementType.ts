import { Core } from '@minddrop/core';
import { RichTextElement, RichTextElementConfig } from '../types';
import { useRichTextStore } from '../useRichTextStore';

/**
 * Registers a new rich text element type and dispatches a
 * `rich-text-elements:register` event.
 *
 * @param core A MindDrop core instance.
 * @param config The configuration of the rich text element type to register.
 */
export function registerRichTextElementType<
  TElement extends RichTextElement = RichTextElement,
  TData = {},
>(core: Core, config: RichTextElementConfig<TElement, TData>): void {
  // Add the config to the rich text store
  useRichTextStore.getState().setElementConfig(config);

  // Dispatch a `rich-text-elements:register` event
  core.dispatch('rich-text-elements:register', config);
}
