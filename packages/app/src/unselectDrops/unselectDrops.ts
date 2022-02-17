import { Core } from '@minddrop/core';
import { Drops } from '@minddrop/drops';
import { useAppStore } from '../useAppStore';

/**
 * Removes drops from the selected drops list and
 * dispatches a `app:unselect-drops` event.
 *
 * @param core A MindDrop core instance.
 * @param dropIds The IDs of the drops to unselect.
 */
export function unselectDrops(core: Core, dropIds: string[]): void {
  // Get the drops
  const drops = Drops.get(dropIds);

  // Remove IDs from the store's selected drops
  useAppStore.getState().removeSelectedDrops(dropIds);

  // Dispatch 'app:unselect-drops' event
  core.dispatch('app:unselect-drops', drops);
}
