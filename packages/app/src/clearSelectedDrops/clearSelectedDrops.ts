import { Core } from '@minddrop/core';
import { useAppStore } from '../useAppStore';

/**
 * Clears the selected drops from the store and
 * dispatches a `app:clear-selected-drops` event.
 *
 * @param core A MindDrop core instance.
 */
export function clearSelectedDrops(core: Core): void {
  // Clear selected drops from the store
  useAppStore.getState().clearSelectedDrops();

  // Dispatch 'app:clear-selected-drops' event
  core.dispatch('app:clear-selected-drops');
}
