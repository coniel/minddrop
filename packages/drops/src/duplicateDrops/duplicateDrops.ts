import { Core } from '@minddrop/core';
import { createDrop } from '../createDrop';
import { getDrops } from '../getDrops';
import { DropMap } from '../types';

/**
 * Duplicates the given drops by creating new drops
 * with the same data.
 *
 * @param core A MindDrop core instance.
 * @param dropIds The IDs of the drops to duplicate.
 * @returns The new drops.
 */
export function duplicateDrops(core: Core, dropIds: string[]): DropMap {
  // Get the drops
  const drops = getDrops(dropIds);

  // Create new drops
  const newDrops = Object.values(drops).map((drop) => {
    // Copy drop data
    const data = { ...drop, duplicatedFrom: drop.id };
    // Remove ID
    delete data.id;
    // Create the new drop
    return createDrop(core, data);
  });

  // Return drop map
  return newDrops.reduce((map, drop) => ({ ...map, [drop.id]: drop }), {});
}
