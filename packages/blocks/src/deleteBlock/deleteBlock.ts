import { Events } from '@minddrop/events';
import { BlocksStore } from '../BlocksStore';
import { BlockNotFoundError } from '../errors';
import { getBlock } from '../getBlock';

/**
 * Remove a block from the store.
 *
 * @param id - The id of the block to remove.
 *
 * @throws {BlockNotFoundError} If the block does not exist.
 *
 * @dispatches blcoks:block:delete
 */
export function deleteBlock(id: string): void {
  const block = getBlock(id);

  // Ensure the block exists
  if (!block) {
    throw new BlockNotFoundError(id);
  }

  // Remove the block from the store
  BlocksStore.getState().remove(id);

  // Dispatch a block delete event
  Events.dispatch('blocks:block:delete', block);
}
