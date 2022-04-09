import { Core } from '@minddrop/core';
import { getTag } from '../getTag';
import { TagsStore } from '../TagsStore';
import { Tag } from '../types';

/**
 * Permanently deletes a tag and dispatches a
 * `tags:delete` event. Returns the deleted tag.
 *
 * @param core A MindDrop core instance.
 * @param tagId The ID of the tag to delete.
 * @returns The deleted tag.
 */
export function deleteTag(core: Core, tagId: string): Tag {
  // Get the tag
  const tag = getTag(tagId);

  // Remove tag from the store
  TagsStore.remove(tagId);

  // Dispatch 'tags:delete' event
  core.dispatch('tags:delete', tag);

  return tag;
}
