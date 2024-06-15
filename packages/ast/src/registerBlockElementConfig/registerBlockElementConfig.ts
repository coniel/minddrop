import { Events } from '@minddrop/events';
import { BlockElementConfigsStore } from '../BlockElementConfigsStore';
import { BlockElementConfig } from '../types';

/**
 * Registers a new block element config.
 *
 * @param config - The config to register.
 * @dispatches markdown:block-element:register
 */
export function registerBlockElementConfig(config: BlockElementConfig): void {
  // Add the config to the store
  BlockElementConfigsStore.add(config);

  // Dispatch a 'markdown:block-element:register' event
  Events.dispatch('markdown:block-element:register', config);
}
