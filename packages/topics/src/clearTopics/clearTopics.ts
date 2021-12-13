import { Core } from '@minddrop/core';
import { useTopicsStore } from '../useTopicsStore';

/**
 * Clears topics from the store by dispatching a `topics:clear` event.
 *
 * @param core A MindDrop core instance.
 */
export function clearTopics(core: Core): void {
  // Clears topics from the store
  useTopicsStore.getState().clear();

  // Dispatch 'topics:clear' event
  core.dispatch('topics:clear');
}
