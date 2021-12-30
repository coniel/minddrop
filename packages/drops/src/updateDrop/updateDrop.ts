import { Core } from '@minddrop/core';
import { createUpdate } from '@minddrop/utils';
import { getDrop } from '../getDrop';
import { Drop, DropChanges } from '../types';
import { useDropsStore } from '../useDropsStore';

/**
 * Updates a drop and dispatches a `drops:update` event.
 * Returns the updated drop.
 *
 * @param core A MindDrop core instance.
 * @param id The ID of the drop to update.
 * @param data The changes to apply to the drop.
 * @returns The updated drop.
 */
export function updateDrop(
  core: Core,
  id: string,
  data: Omit<DropChanges, 'updatedAt'>,
): Drop {
  const drop = getDrop(id);
  const update = createUpdate(drop, data, {
    setUpdatedAt: true,
    deleteEmptyFields: ['files'],
  });

  // Update drop in store
  useDropsStore.getState().setDrop(update.after);

  // Dispatch 'drops:update' event
  core.dispatch('drops:update', update);

  return update.after;
}
