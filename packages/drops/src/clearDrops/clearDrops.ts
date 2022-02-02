import { Core } from '@minddrop/core';
import { useDropsStore } from '../useDropsStore';

/**
 * Clears drops from the store and dispatches a `drops:clear-drops` event.
 *
 * @param core A MindDrop core instance.
 */
export function clearDrops(core: Core): void {
  // Clear drops from the store
  useDropsStore.getState().clearDrops();

  // Dispatch 'drops:clear' event
  core.dispatch('drops:clear-drops');
}
