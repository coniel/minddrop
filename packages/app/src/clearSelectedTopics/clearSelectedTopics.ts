import { Core } from '@minddrop/core';
import { useAppStore } from '../useAppStore';

/**
 * Clears the selected topics list and dispatches a
 * `app:selected-topics:clear` event.
 *
 * @param core A MindTopic core instance.
 */
export function clearSelectedTopics(core: Core): void {
  // Clear selected topics from the store
  useAppStore.getState().clearSelectedTopics();

  // Dispatch 'app:selected-topics:clear' event
  core.dispatch('app:selected-topics:clear');
}
