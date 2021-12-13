import { Core } from '@minddrop/core';

/**
 * Clears topics from the store by dispatching a `topics:clear` event.
 *
 * @param core A MindDrop core instance.
 */
export function clearTopics(core: Core): void {
  // Dispatch 'topics:clear' event
  core.dispatch('topics:clear');
}
