import { Events } from '@minddrop/events';
import { BlockElementParserConfigsStore } from '../BlockElementParserConfigsStore';

/**
 * Unregisters a BlockElementParserConfig from the BlockElementParserConfigsStore.
 *
 * @param type - The type of the config to unregister.
 * @dispatches markdown:block-element-parser:unregister
 */
export function unregisterBlockElementParserConfig(type: string): void {
  // Remove the config from the BlockElementParserConfigsStore, using
  // the type as the ID.
  BlockElementParserConfigsStore.remove(type);

  // Dispatch a 'markdown:block-element-parser:unregister' event
  Events.dispatch('markdown:block-element-parser:unregister', type);
}
