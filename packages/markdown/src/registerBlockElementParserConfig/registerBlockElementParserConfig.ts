import { Events } from '@minddrop/events';
import { BlockElementParserConfigsStore } from '../BlockElementParserConfigsStore';
import { BlockElementParserConfig } from '../types';

/**
 * Registers a new BlockElementParserConfig.
 *
 * @param config - The config to register.
 * @dispatches markdown:block-element-parser:register
 */
export function registerBlockElementParserConfig(
  config: BlockElementParserConfig,
): void {
  // Add the config to the BlockElementParserConfigsStore,
  // using the type as its ID.
  const registeredConfig = { ...config, id: config.type };

  // Add the config to the store
  BlockElementParserConfigsStore.set(registeredConfig);

  // Dispatch a 'markdown:block-element-parser:register' event
  Events.dispatch('markdown:block-element-parser:register', registeredConfig);
}
