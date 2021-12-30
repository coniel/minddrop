import { Core } from '@minddrop/core';
import { getTag } from '../getTag';
import { Tag } from '../types';
import { useTagsStore } from '../useTagsStore';

/**
 * Permanently deletes a tag and dispatches a
 * `tags:delete` event. Returns the deleted tag.
 *
 * @param core A MindDrop core instance.
 * @param tagId The ID of the tag to delete.
 * @returns The deleted tag.
 */
export function deleteTag(core: Core, tagId: string): Tag {
  const tag = getTag(tagId);

  // Remove tag from the store
  useTagsStore.getState().removeTag(tagId);

  // Dispatch 'tags:delete' event
  core.dispatch('tags:delete', tag);

  return tag;
}
