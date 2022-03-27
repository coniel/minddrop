import { Core } from '@minddrop/core';
import { RichTextElementTypeAlreadyRegisteredError } from '../errors';
import {
  RichTextBlockElementConfig,
  RichTextInlineElementConfig,
} from '../types';
import { useRichTextStore } from '../useRichTextStore';

/**
 * Registers a new rich text element type and dispatches a
 * `rich-text-elements:register` event.
 *
 * Throws a `RichTextElementTypeAlreadyRegisteredError` if the element type
 * is already registered.
 *
 * @param core A MindDrop core instance.
 * @param config The configuration of the rich text element type to register.
 */
export function registerRichTextElementType(
  core: Core,
  config: RichTextBlockElementConfig | RichTextInlineElementConfig,
): void {
  // Check if element type is already registered
  const alreadyRegistered =
    !!useRichTextStore.getState().elementConfigs[config.type];

  // Throw a `RichTextElementTypeAlreadyRegisteredError` if already registered
  if (alreadyRegistered) {
    throw new RichTextElementTypeAlreadyRegisteredError(config.type);
  }

  // Add the config to the rich text store
  useRichTextStore.getState().setElementConfig(config);

  // Dispatch a `rich-text-elements:register` event
  core.dispatch('rich-text-elements:register', config);
}
