import { Events } from '@minddrop/events';
import { Block } from '../types';
import { BlocksStore } from '../BlocksStore';
import { BlockNotFoundError } from '../errors';
import { getBlock } from '../getBlock';

/**
 * Updates a block in the store. Returns the updated block.
 *
 * @param id - The block ID.
 * @param data - The block data.
 * @returns The updated block.
 *
 * @throws {BlockNotFoundError} Thrown if the block is not found.
 */
export function updateBlock(id: string, data: Partial<Block>): Block {
  // Ensure the block exists
  if (!getBlock(id)) {
    throw new BlockNotFoundError(id);
  }

  // Update the block in the store, including the last
  // modified timestamp.
  BlocksStore.getState().update(id, { ...data, lastModified: new Date() });

  // Get the updated block
  const block = getBlock(id)!;

  // Dispatch a block update event
  Events.dispatch('blocks:block:update', block);

  return block;
}
