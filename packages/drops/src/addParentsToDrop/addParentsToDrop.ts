import { Core } from '@minddrop/core';
import { FieldValue } from '@minddrop/utils';
import { Drop } from '../types';
import { updateDrop } from '../updateDrop';

/**
 * Adds parent IDs to a drop and dispatches a
 * `drops:add-parents` event.
 *
 * @param core A MindDrop core instance.
 * @param dropId The ID of the drop to which to add the parents.
 * @param parentIds The IDs of the parents to add.
 */
export function addParentsToDrop(
  core: Core,
  dropId: string,
  parentIds: string[],
): Drop {
  // Add new parent IDs to the drop
  const drop = updateDrop(core, dropId, {
    parents: FieldValue.arrayUnion(parentIds),
  });

  // Dispatch 'drops:add-parents' event
  core.dispatch('drops:add-parents', { drop, parents: parentIds });

  return drop;
}
