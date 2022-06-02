import { Core } from '@minddrop/core';
import { useAppStore } from '../useAppStore';

/**
 * Clears the selected drops list and dispatches a
 * `app:selected-drops:clear` event.
 *
 * @param core A MindDrop core instance.
 */
export function clearSelectedDrops(core: Core): void {
  // Clear selected drops from the store
  useAppStore.getState().clearSelectedDrops();

  // Dispatch 'app:selected-drops:clear' event
  core.dispatch('app:selected-drops:clear');
}
