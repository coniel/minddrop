import { Core } from '@minddrop/core';
import { getDrop } from '../getDrop';

/**
 * Permanently deletes a drop and dispatches a
 * `drops:delete-permanently` event.
 *
 * @param core A MindDrop core instance.
 * @param dropId The ID of the drop to delete permanently.
 */
export function deleteDropPermanently(core: Core, dropId: string): void {
  const drop = getDrop(dropId);

  // Dispatch 'drops:delete-permanently' event
  core.dispatch('drops:delete-permanently', drop);
}