import { Events } from '@minddrop/events';
import { BlockElementConfigsStore } from '../BlockElementConfigsStore';

/**
 * Unregisters a block element config from the store.
 *
 * @param type - The element type of the config to unregister.
 * @dispatches markdown:block-element:unregister
 */
export function unregisterBlockElementConfig(type: string): void {
  // Remove the config from the BlockElementConfigsStore
  BlockElementConfigsStore.remove(type);

  // Dispatch a 'markdown:block-element:unregister' event
  Events.dispatch('markdown:block-element:unregister', type);
}
