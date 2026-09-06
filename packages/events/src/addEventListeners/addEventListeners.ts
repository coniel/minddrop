import { addEventListener } from '../addEventListener';
import {
  EventListenerCallback,
  EventListenerCallbackMap,
  EventName,
} from '../types';

/**
 * Adds a listener for each event in the callbacks map, all under
 * the same listener ID.
 *
 * Skips events on which a listener with the same ID is already
 * registered.
 *
 * @param listenerId - The ID of the listener which is being added.
 * @param callbacks - Callback functions keyed by event name.
 */
export function addEventListeners(
  listenerId: string,
  callbacks: EventListenerCallbackMap,
): void {
  // Register the listener on each event in the map. The entries
  // lose the per-event pairing of name and callback data type, so
  // the callback is widened back to the event name's data.
  Object.entries(callbacks).forEach(([eventName, callback]) => {
    // Skip events without a callback
    if (!callback) {
      return;
    }

    addEventListener(
      eventName as EventName,
      listenerId,
      callback as EventListenerCallback,
    );
  });
}
