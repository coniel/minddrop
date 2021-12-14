import { Core } from '@minddrop/core';
import { useTagsStore } from '../useTagsStore';

/**
 * Clears tags from the store and dispatches a `tags:clear` event.
 *
 * @param core A MindDrop core instance.
 */
export function clearTags(core: Core): void {
  // Clear tags from the store
  useTagsStore.getState().clear();

  // Dispatch 'tags:clear' event
  core.dispatch('tags:clear');
}
