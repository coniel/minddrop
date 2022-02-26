import { Core } from '@minddrop/core';
import { FieldValue } from '@minddrop/utils';
import { Drop, DropParentReference } from '../types';
import { updateDrop } from '../updateDrop';

/**
 * Adds parent references to a drop and dispatches a
 * `drops:add-parents` event.
 *
 * @param core A MindDrop core instance.
 * @param dropId The ID of the drop to which to add the parents.
 * @param parentReferences The parent references to add.
 */
export function addParentsToDrop(
  core: Core,
  dropId: string,
  parentReferences: DropParentReference[],
): Drop {
  // Add new parent references to the drop
  const drop = updateDrop(core, dropId, {
    parents: FieldValue.arrayUnion(parentReferences),
  });

  // Dispatch 'drops:add-parents' event
  core.dispatch('drops:add-parents', { drop, parents: parentReferences });

  return drop;
}
