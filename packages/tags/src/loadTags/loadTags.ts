import { Core } from '@minddrop/core';
import { Tag } from '../types';
import { useTagsStore } from '../useTagsStore';

/**
 * Loads tags into the store and dispatches a `tags:load` event.
 *
 * @param core A MindDrop core instance.
 * @param tags The tags to load.
 */
export function loadTags(core: Core, tags: Tag[]): void {
  // Loads tags into the store
  useTagsStore.getState().loadTags(tags);

  // Dispatch 'tags:load' event
  core.dispatch('tags:load', tags);
}
