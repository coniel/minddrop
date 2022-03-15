import { Core } from '@minddrop/core';
import { createUpdate } from '@minddrop/utils';
import { getDrop } from '../getDrop';
import { Drop, DropChanges } from '../types';
import { useDropsStore } from '../useDropsStore';

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
export function updateDrop<D extends Data = Data, R extends Drop = Drop>(
  core: Core,
  id: string,
  data: D,
): R {
  const drop = getDrop<R>(id);
  const update = createUpdate<D, R>(drop, data, {
    setUpdatedAt: true,
    deleteEmptyFields: ['files'],
  });

  // Update drop in store
  useDropsStore.getState().setDrop(update.after);

  // Dispatch 'drops:update' event
  core.dispatch('drops:update', update);

  return update.after;
}
