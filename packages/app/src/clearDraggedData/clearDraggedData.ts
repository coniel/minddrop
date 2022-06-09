import { Core } from '@minddrop/core';
import { useAppStore } from '../useAppStore';

/**
 * Clears data about items currently being dragged and
 * dispatches a `app:drag:end` event.
 *
 * @param core A MindDrop core instance.
 */
export function clearDraggedData(core: Core): void {
  // Clears the dragged data in the store
  useAppStore.getState().clearDraggedData();

  // Dispatches 'app:drag:end' event
  core.dispatch('app:drag:end');
}
