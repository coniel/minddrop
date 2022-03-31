import { Core } from '@minddrop/core';
import { createUpdate } from '@minddrop/utils';
import { getDrop } from '../getDrop';
import { Drop, DropChanges } from '../types';
import { useDropsStore } from '../useDropsStore';

// Updated at is set automatically and should not
// be specified in the udapte data.
type Data = Omit<DropChanges, 'updatedAt'>;

/**
 * Updates a drop and dispatches a `drops:update` event.
 * Returns the updated drop.
 *
 * @param core A MindDrop core instance.
 * @param id The ID of the drop to update.
 * @param data The changes to apply to the drop.
 * @returns The updated drop.
 */
export function updateDrop<
  TDrop extends Drop = Drop,
  TData extends Data = Data,
>(core: Core, id: string, data: TData): TDrop {
  // Get the drop
  const drop = getDrop<TDrop>(id);

  // Create an update object
  const update = createUpdate(drop, data, {
    setUpdatedAt: true,
    deleteEmptyFields: ['files'],
  });

  // Update drop in store
  useDropsStore.getState().setDrop(update.after);

  // Dispatch 'drops:update' event
  core.dispatch('drops:update', update);

  // Return the updated drop
  return update.after;
}
