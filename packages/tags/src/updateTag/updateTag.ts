import { Core } from '@minddrop/core';
import { createUpdate } from '@minddrop/utils';
import { getTag } from '../getTag';
import { TagsStore } from '../TagsStore';
import { Tag, TagChanges } from '../types';

/**
 * Updates a tag and dispatches a `tags:update` event.
 * Returns the updated tag.
 *
 * - Throws a `TagNotFoundError` if the tag does not
 *   exist.
 *
 * @param core A MindDrop core instance.
 * @param id The ID of the tag to update.
 * @param data The changes to apply to the tag.
 * @returns The updated tag.
 */
export function updateTag(core: Core, id: string, data: TagChanges): Tag {
  // Get the tag
  const tag = getTag(id);

  // Create an update, setting the updated data
  const update = createUpdate(tag, data);

  // Update the tag in the store
  TagsStore.set(update.after);

  // Dispatch a 'tags:update' event
  core.dispatch('tags:update', update);

  // Return the updated tag
  return update.after;
}
