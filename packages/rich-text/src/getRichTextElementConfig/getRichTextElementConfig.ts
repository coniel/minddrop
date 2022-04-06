import { RichTextElementTypeNotRegisteredError } from '../errors';
import { RichTextElementConfig } from '../types';
import { useRichTextStore } from '../useRichTextStore';

/**
 * Returns an element type's configuration object.
 *
 * Throws a `RichTextElementTypeNotRegisteredError` if the element
 * type is not registered.
 *
 * @param type The type of the element for wich to retrieve the config.
 * @returns The element's config object.
 */
export function getRichTextElementConfig<
  TConfig extends RichTextElementConfig = RichTextElementConfig,
>(type: string): TConfig {
  // Get the config from the store
  const config = useRichTextStore.getState().elementConfigs[type];

  if (!config) {
    // Throw a `RichTextElementTypeNotRegisteredError`
    // if the element type is not registered.
    throw new RichTextElementTypeNotRegisteredError(type);
  }

  // Return the config
  return config as TConfig;
}
