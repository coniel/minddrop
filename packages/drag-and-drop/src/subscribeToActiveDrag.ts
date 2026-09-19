import { DragStore } from './DragStore';
import { ActiveDrag } from './types';

/**
 * Subscribes to the drag in progress changing. The listener is
 * called synchronously with the drag as it starts and with null as
 * it ends.
 *
 * @param listener - Called with the drag in progress on every change.
 * @returns A function which unsubscribes the listener.
 */
export function subscribeToActiveDrag(
  listener: (drag: ActiveDrag | null) => void,
): VoidFunction {
  // Subscribe to the store
  return DragStore.subscribe((state, previous) => {
    // Call the listener only when the drag itself changed
    if (state.active !== previous.active) {
      listener(state.active);
    }
  });
}
