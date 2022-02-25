import { Core } from '@minddrop/core';
import { FieldValue } from '@minddrop/utils';
import { Drop } from '../types';
import { updateDrop } from '../updateDrop';

/**
 * Removes parent IDs from a drop and dispatches a
 * `drops:remove-parents` event.
 *
 * @param core A MindDrop core instance.
 * @param dropId The ID of the drop from which to remove the parents.
 * @param parentIds The IDs of the parents to remove.
 */
export function removeParentsFromDrop(
  core: Core,
  dropId: string,
  parentIds: string[],
): Drop {
  // Remove parent IDs from the drop
  const drop = updateDrop(core, dropId, {
    parents: FieldValue.arrayRemove(parentIds),
  });

  // Dispatch 'drops:remove-parents' event
  core.dispatch('drops:remove-parents', { drop, parents: parentIds });

  return drop;
}
