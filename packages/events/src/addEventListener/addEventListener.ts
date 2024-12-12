import { hasEventListener } from '../hasEventListener';
import { EventListenerCallback, EventListenerMap } from '../types';

/**
 * Adds the listener function to the **end** of the listeners array for
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
export function addEventListener<TData = unknown>(
  eventListeners: EventListenerMap<TData>,
  eventName: string,
  listenerId: string,
  callback: EventListenerCallback<TData>,
  once = false,
): void {
  // If the listener is already registered for this event,
  // don't add it again.
  if (hasEventListener(eventListeners, eventName, listenerId)) {
    return;
  }

  // If the event has not yet been set up, add an
  // entry for it.
  if (!eventListeners[eventName]) {
    eventListeners[eventName] = {
      listeners: [],
    };
  }

  // Append the event listener to the event's
  // listeners array.
  eventListeners[eventName].listeners.push({ id: listenerId, callback, once });
}
