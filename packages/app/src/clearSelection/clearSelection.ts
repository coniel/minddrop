import { Core } from '@minddrop/core';
import { useAppStore } from '../useAppStore';

/**
 * Clears the current selection of topics and drops
 * and dispatches a 'app:selection:clear' event.
 *
 * @param core A MindDrop core instance.
 */
export function clearSelection(core: Core): void {
  // Clear selected drops
  useAppStore.getState().clearSelectedDrops();
  // Clear selected topics
  useAppStore.getState().clearSelectedTopics();

  // Dispatch 'app:selection:clear' event
  core.dispatch('app:selection:clear');
}
