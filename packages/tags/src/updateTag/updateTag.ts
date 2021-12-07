import { Core } from '@minddrop/core';
import { createUpdate } from '@minddrop/utils';
import { getTag } from '../getTag';
import { Tag, TagChanges } from '../types';

/**
 * Applies data changes to a tag and dispatches a
 * `tags:update` event. Returns the updated tag.
 *
 * @param core A MindDrop core instance.
 * @param id The ID of the tag to update.
 * @param data The changes to apply to the tag.
 * @returns The updated tag.
 */
export function updateTag(core: Core, id: string, data: TagChanges): Tag {
  const tag = getTag(id);
  const update = createUpdate(tag, data);

  core.dispatch('tags:update', update);

  return update.after;
}
