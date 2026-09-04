import { addEventListener } from '../addEventListener';
import { EventListenerCallback, EventListenerMap } from '../types';

/**
 * Adds a listener function to the **end** of the listeners array
 * of each event in the callbacks map, all under the same listener ID.
 *
 * Skips events on which a listener with the same ID has already
 * registered.
 *
 * @param eventListeners - Event listeners map.
 * @param listenerId - The ID of the listener which is being added.
 * @param callbacks - Callback functions keyed by event name. Typed on
 * `never` so that callbacks of every event data type are accepted.
 */
export function addEventListeners(
  eventListeners: EventListenerMap,
  listenerId: string,
  callbacks: Record<string, EventListenerCallback<never> | undefined>,
): void {
  // Register the listener on each event in the map
  Object.entries(callbacks).forEach(([eventName, callback]) => {
    // Skip events without a callback
    if (!callback) {
      return;
    }

    addEventListener(eventListeners, eventName, listenerId, callback);
  });
}
