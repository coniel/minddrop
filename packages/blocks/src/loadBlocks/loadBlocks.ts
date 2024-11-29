import { Events } from '@minddrop/events';
import { BlocksStore } from '../BlocksStore';
import { Block } from '../types';

/**
 * Loads new blocks into the store.
 *
 * @param blocks - The blocks to load.
 *
 * @dispatches blocks:load
 */
export function loadBlocks(blocks: Block[]): void {
  // Load the blocks into the store
  BlocksStore.getState().load(blocks);

  // Dispatch a blocks load event
  Events.dispatch('blocks:load', blocks);
}
