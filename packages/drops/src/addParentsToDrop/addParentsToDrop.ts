import { Core, ParentReference, ParentReferences } from '@minddrop/core';
import { FieldValue } from '@minddrop/utils';
import { getDrop } from '../getDrop';
import { restoreDrop } from '../restoreDrop';
import { Drop } from '../types';
import { updateDrop } from '../updateDrop';

/**
 * Adds parent references to a drop and dispatches a
 * `drops:add-parents` event.
 *
 * - Throws a `DropNotFoundError` if the drop does not exist.
 * - Throws a `ParentReferenceValidationError` if any of the
 *   parents are invalid.
 *
 * @param core A MindDrop core instance.
 * @param dropId The ID of the drop to which to add the parents.
 * @param parents The parent references to add.
 */
export function addParentsToDrop<TDrop extends Drop = Drop>(
  core: Core,
  dropId: string,
  parents: ParentReference[],
): TDrop {
  // Validate the parent references
  ParentReferences.validate(parents);

  // Get the drop
  let drop = getDrop<TDrop>(dropId);

  if (drop.deleted) {
    // Restore the drop if deleted
    restoreDrop(core, drop.id);

    // Replace old parents with new ones
    drop = updateDrop(core, dropId, { parents });
  } else {
    // Add new parent references to the drop
    drop = updateDrop(core, dropId, {
      parents: FieldValue.arrayUnion(parents),
    });
  }

  // Dispatch a 'drops:add-parents' event
  core.dispatch('drops:add-parents', { drop, parents });

  // Return the updated drop
  return drop;
}
