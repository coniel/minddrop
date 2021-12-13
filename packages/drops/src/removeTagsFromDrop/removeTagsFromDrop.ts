import { Core } from '@minddrop/core';
import { FieldValue } from '@minddrop/utils';
import { Tags } from '@minddrop/tags';
import { Drop } from '../types';
import { updateDrop } from '../updateDrop';

/**
 * Removes tags from a drop and dispatches a `drops:remove-tags` event
 * and a `drops:update` event.
 *
 * @param core A MindDrop core instance.
 * @param dropId The ID of the drop from which to remove the tags.
 * @param tagIds The IDs of the tags to remove.
 * @returns The updated drop.
 */
export function removeTagsFromDrop(
  core: Core,
  dropId: string,
  tagIds: string[],
): Drop {
  const tags = Tags.get(tagIds);
  const drop = updateDrop(core, dropId, {
    tags: FieldValue.arrayRemove(tagIds),
  });

  core.dispatch('drops:remove-tags', { drop, tags });

  return drop;
}
