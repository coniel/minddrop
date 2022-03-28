import { Core } from '@minddrop/core';
import { getRichTextElementConfig } from '../getRichTextElementConfig';
import { useRichTextStore } from '../useRichTextStore';

/**
 * Unregisters a rich text element type and dispaches a
 * `rich-text-elements:unregister` event.
 *
 * Throws a `RichTextElementTypeNotRegisteredError` if the
 * rich text element type is not registered.
 *
 * @param core A MindDrop core instance.
 * @param type The type of the rich text element to unregister.
 */
export function unregisterRichTextElementType(core: Core, type: string): void {
  // Get the element config, throws if element type is not registered
  const config = getRichTextElementConfig(type);

  // Remove the config from the rich text store
  useRichTextStore.getState().removeElementConfig(type);

  // Dispatch a 'rich-text-elements:unregister' event
  core.dispatch('rich-text-elements:unregister', config);
}
