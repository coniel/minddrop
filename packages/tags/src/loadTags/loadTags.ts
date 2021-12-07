import { Core } from '@minddrop/core';
import { Tag } from '../types';

/**
 * Lodas tags into the store by dispatching a `tags:load` event.
 *
 * @param core A MindDrop core instance.
 * @param tags The tags to load.
 */
export function loadTags(core: Core, tags: Tag[]): void {
  // Dispatch 'tags:load' event
  core.dispatch('tags:load', tags);
}
