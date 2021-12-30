import { Core } from '@minddrop/core';
import { useDropsStore } from '../useDropsStore';

/**
 * Clears drops from the store and dispatches a `drops:clear` event.
 *
 * @param core A MindDrop core instance.
 */
export function clearDrops(core: Core): void {
  // Clear drops from the store
  useDropsStore.getState().clear();

  // Dispatch 'drops:clear' event
  core.dispatch('drops:clear');
}
