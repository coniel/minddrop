import { Core } from '@minddrop/core';
import { TagsStore } from '../TagsStore';
import { Tag } from '../types';

/**
 * Loads tags into the store and dispatches a `tags:load` event.
 *
 * @param core A MindDrop core instance.
 * @param tags The tags to load.
 */
export function loadTags(core: Core, tags: Tag[]): void {
  // Loads tags into the store
  TagsStore.load(tags);

  // Dispatch 'tags:load' event
  core.dispatch('tags:load', tags);
}
