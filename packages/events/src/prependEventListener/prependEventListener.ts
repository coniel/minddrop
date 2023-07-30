import { addEventListener } from '../addEventListener';
import { hasEventListener } from '../hasEventListener';
import { EventListenerCallback, EventListenerMap } from '../types';

/**
 * Adds the listener function to the **beginning** of the listeners array for
 * the event named `eventName`.
 *
 * Does not add the listener if an event listener with the same ID
 * has already registered.
 *
 * @param eventListeners - Event listeners map.
 * @param eventName - The name of the event to listen for.
 * @param listenerId - The ID of the listener which is being added.
 * @param callback - The  callback function.
 * @param once - When `true`, the listener is removed when triggered.
 */
export function prependEventListener(
  eventListeners: EventListenerMap,
  eventName: string,
  listenerId: string,
  callback: EventListenerCallback,
  once = false,
): void {
  // If the listener is already registered for this event,
  // don't add it again.
  if (hasEventListener(eventListeners, eventName, listenerId)) {
    return;
  }

  // If the event has not yet been set up, simply add
  // a listener for it.
  if (!eventListeners[eventName]) {
    return addEventListener(
      eventListeners,
      eventName,
      listenerId,
      callback,
      once,
    );
  }

  // Prepend the event listener to the event's
  // listeners array.
  eventListeners[eventName].listeners.unshift({
    id: listenerId,
    callback,
    once,
  });
}
