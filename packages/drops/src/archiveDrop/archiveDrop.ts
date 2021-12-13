import { Core } from '@minddrop/core';
import { Drop } from '../types';
import { updateDrop } from '../updateDrop';

/**
 * Archives a drop and dispatches a `drops:archive`
 * event and a `drops:update` event.
 *
 * @param core A MindDrop core instance.
 * @param dropId The ID of the drop to archive.
 * @returns The archived drop.
 */
export function archiveDrop(core: Core, dropId: string): Drop {
  // Update the drop
  const updated = updateDrop(core, dropId, {
    archived: true,
    archivedAt: new Date(),
  });

  // Dispatch 'drops:archive' event
  core.dispatch('drops:archive', updated);

  return updated;
}
