import { Core } from '@minddrop/core';
import { Tags } from '@minddrop/tags';
import { FieldValue } from '@minddrop/utils';
import { Drop } from '../types';
import { updateDrop } from '../updateDrop';

/**
 * Adds tags to a drop and dispatches a `drops:add-tags` event
 * and a `drops:update` event.
 *
 * @param core A MindDrop core instance.
 * @param dropId The ID of the drop to which to add the tags.
 * @param tagIds The IDs of the tags to add to the drop.
 * @returns The updated drop.
 */
export function addTagsToDrop(
  core: Core,
  dropId: string,
  tagIds: string[],
): Drop {
  // Check that tags exist
  const tags = Tags.get(tagIds);

  const drop = updateDrop(core, dropId, {
    tags: FieldValue.arrayUnion(tagIds),
  });

  core.dispatch('drops:add-tags', {
    drop,
    tags,
  });

  return drop;
}
