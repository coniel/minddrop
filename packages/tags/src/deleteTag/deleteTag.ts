import { Core } from '@minddrop/core';
import { getTag } from '../getTag';

/**
 * Permanently deletes a tag and dispatches a
 * `tags:delete` event.
 *
 * @param core A MindDrop core instance.
 * @param tagId The ID of the tag to delete.
 */
export function deleteTag(core: Core, tagId: string): void {
  const tag = getTag(tagId);

  // Dispatch 'tags:delete' event
  core.dispatch('tags:delete', tag);
}
