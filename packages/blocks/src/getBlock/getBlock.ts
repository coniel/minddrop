import { BlocksStore } from '../BlocksStore';
import { Block } from '../types';

/**
 * Reutrns a block by id or null if not found.
 *
 * @param id - The block id.
 * @returns The block or null.
 */
export function getBlock(id: string): Block | null {
  return BlocksStore.getState().blocks.find((block) => block.id === id) || null;
}
