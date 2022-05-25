import { Core } from '@minddrop/core';
import { DropsResource } from '../DropsResource';
import { Drop, DropMap } from '../types';

/**
 * Duplicates the specified drops by creating new drops
 * with the same data.
 *
 * @param core - A MindDrop core instance.
 * @param dropIds - The IDs of the drops to duplicate.
 * @returns The new drops.
 */
export function duplicateDrops<TTypeData>(
  core: Core,
  dropIds: string[],
): DropMap<Drop<TTypeData>> {
  // Get the drops
  const drops = DropsResource.get(dropIds);

  // Create new drops
  const newDrops = Object.values(drops).map((drop) => {
    // Get the drop type config
    const config = DropsResource.getTypeConfig(drop.type);

    // Copy drop data
    let data = { ...drop, duplicatedFrom: drop.id };

    if (config.duplicateData) {
      // Merge in the type config's `duplicateData` data
      data = { ...data, ...config.duplicateData(drop) };
    }

    // Remove the original drop ID
    delete data.id;

    // Create the new drop
    return DropsResource.create(core, drop.type, data);
  });

  // Return drop map
  return newDrops.reduce((map, drop) => ({ ...map, [drop.id]: drop }), {});
}
