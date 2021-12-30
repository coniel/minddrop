import { Core } from '@minddrop/core';
import { getDrop } from '../getDrop';
import { Drop } from '../types';
import { useDropsStore } from '../useDropsStore';

/**
 * Permanently deletes a drop and dispatches a
 * `drops:delete-permanently` event.
 *
 * @param core A MindDrop core instance.
 * @param dropId The ID of the drop to delete permanently.
 */
export function deleteDropPermanently(core: Core, dropId: string): Drop {
  const drop = getDrop(dropId);

  // Remove drop from store
  useDropsStore.getState().removeDrop(drop.id);

  // Dispatch 'drops:delete-permanently' event
  core.dispatch('drops:delete-permanently', drop);

  return drop;
}
