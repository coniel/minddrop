import { Core } from '@minddrop/core';

/**
 * Clears tags from the store by dispatching a `tags:clear` event.
 *
 * @param core A MindDrop core instance.
 */
export function clearTags(core: Core): void {
  // Dispatch 'tags:clear' event
  core.dispatch('tags:clear');
}
