import { Block } from '../types';
import { BlocksStore as useBlocksStore } from '../BlocksStore';

/**
 * Returns a block vy ID, or `null` if not found.
 *
 * @param id - The block id.
 * @returns A block object or null.
 */
export function useBlock(id: string): Block | null {
  return useBlocksStore().blocks[id] || null;
}
