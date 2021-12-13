import { Core } from '@minddrop/core';
import { Drop } from '../types';
import { updateDrop } from '../updateDrop';

/**
 * Deletes a drop and dispatches a `drops:delete`
 * event and a `drops:update` event.
 *
 * @param core A MindDrop core instance.
 * @param dropId The ID of the drop to delete.
 * @returns The deleted drop.
 */
export function deleteDrop(core: Core, dropId: string): Drop {
  // Update the drop
  const updated = updateDrop(core, dropId, {
    deleted: true,
    deletedAt: new Date(),
  });

  // Dispatch 'drops:delete' event
  core.dispatch('drops:delete', updated);

  return updated;
}
