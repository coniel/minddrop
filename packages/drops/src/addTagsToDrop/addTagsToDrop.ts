import { Core } from '@minddrop/core';
import { Tags } from '@minddrop/tags';
import { FieldValue } from '@minddrop/utils';
import { Drop } from '../types';
import { updateDrop } from '../updateDrop';

/**
 * Adds tags to a drop and dispatches a `drops:add-tags` event.
 *
 * - Throws a `DropNotFoundError` if the drop does not exist.
 * - Throws a `TagNotFoundError` if any of the tags do not exist.
 *
 * @param core A MindDrop core instance.
 * @param dropId The ID of the drop to which to add the tags.
 * @param tagIds The IDs of the tags to add to the drop.
 * @returns The updated drop.
 */
export function addTagsToDrop<TDrop extends Drop = Drop>(
  core: Core,
  dropId: string,
  tagIds: string[],
): TDrop {
  // Check that tags exist
  const tags = Tags.get(tagIds);

  // Update the drop, adding the tag IDs
  const drop = updateDrop<TDrop>(core, dropId, {
    tags: FieldValue.arrayUnion(tagIds),
  });

  // Dispatch a 'drops:add-tags' event
  core.dispatch('drops:add-tags', { drop, tags });

  // Return the updated drop
  return drop;
}
