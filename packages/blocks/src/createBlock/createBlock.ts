import { Events } from '@minddrop/events';
import { BlocksStore } from '../BlocksStore';
import { generateBlock } from '../generateBlock';
import { Block, BlockData } from '../types';

/**
 * Generate a new block and inserts it into the store.
 *
 * @param type - The block type.
 * @param data - The block data.
 * @param variant - The block variant, defaults to block type's default variant.
 * @returns The new block.
 *
 * @dispatches blocks:block:create
 */
export function createBlock(
  type: string,
  data: BlockData = {},
  variant?: string,
): Block {
  // Generate a new block
  const block = generateBlock(type, data, variant);

  // Insert the block into the store
  BlocksStore.getState().add(block);

  // Dispatch a block create event
  Events.dispatch('blocks:block:create', block);

  return block;
}
