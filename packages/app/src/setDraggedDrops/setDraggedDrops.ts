import { Core } from '@minddrop/core';
import { Drops } from '@minddrop/drops';
import { useAppStore } from '../useAppStore';

/**
 * Sets dropps as currently being dragged and dispatches a
 * `app:drag:drag-drops` event.
 *
 * @param core A MindDrop core instance.
 * @param dropIds The IDs of the drops being dragged.
 */
export function setDraggedDrops(core: Core, dropIds: string[]): void {
  // Set dragged drop IDs in store
  useAppStore.getState().setDraggedData({ drops: dropIds });

  // Get the dragged drops
  const drops = Drops.get(dropIds);

  // Dispatch 'app:drag:drag-drops' event
  core.dispatch('app:drag:drag-drops', drops);
}
