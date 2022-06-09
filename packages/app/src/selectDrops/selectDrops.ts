import { Core } from '@minddrop/core';
import { Drops } from '@minddrop/drops';
import { useAppStore } from '../useAppStore';

/**
 * Adds drops to the selected drops list and
 * dispatches a `app:selection:select-drops` event.
 *
 * @param core A MindDrop core instance.
 * @param dropIds The IDs of the drops to select.
 */
export function selectDrops(core: Core, dropIds: string[]): void {
  // Get the drops
  const drops = Drops.get(dropIds);

  // Add IDs to the store's selected drops
  useAppStore.getState().addSelectedDrops(dropIds);

  // Dispatch 'app:selection:select-drops' event
  core.dispatch('app:selection:select-drops', drops);
}
