import { BlocksStore } from '../BlocksStore';
import { Block } from '../types';

/**
 * Returns a block by ID or an array of blocks by IDs.
 *
 * If a single block is requested but not found, null is returned.
 *
 * If multiple blocks are requested, the returned array will
 * omit any blocks that were not found.
 *
 * @param id - The block ID or IDs.
 * @returns The block(s) or null in the case of a signle block not being found.
 */
export function getBlock(id: string): Block | null;
export function getBlock(id: string[]): Block[];
export function getBlock(id: string | string[]): Block | Block[] | null {
  if (Array.isArray(id)) {
    // Turn the arrau of IDs into a set to remove duplicates
    // and improve performance.
    const uniqueIds = new Set(id);

    return BlocksStore.getState().blocks.filter((block) =>
      uniqueIds.has(block.id),
    );
  }

  return BlocksStore.getState().blocks.find((block) => block.id === id) || null;
}
