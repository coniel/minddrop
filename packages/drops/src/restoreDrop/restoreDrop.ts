import { Core } from '@minddrop/core';
import { FieldValue } from '@minddrop/utils';
import { Drop } from '../types';
import { updateDrop } from '../updateDrop';

/**
 * Restores a deleted drop and dispatches a
 * `drops:restore` event and a `drops:update` event.
 *
 * @param core A MindDrop core instance.
 * @param dropId The ID of the drop to restore.
 * @returns The restored drop.
 */
export function restoreDrop(core: Core, dropId: string): Drop {
  // Update the drop
  const updated = updateDrop(core, dropId, {
    deleted: FieldValue.delete(),
    deletedAt: FieldValue.delete(),
  });

  // Dispatch 'drops:restore' event
  core.dispatch('drops:restore', updated);

  return updated;
}
