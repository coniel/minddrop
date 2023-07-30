import { hasEventListener } from '../hasEventListener';
import { EventListenerCallback, EventListenerMap } from '../types';

/**
 * Adds the listener function to the index immediately **before** the specified
 * listener in the listeners array for the event named `eventName`.
 *
 * Does not add the listener if `afterListenerId` is not a registered listener
 * or if the listener is already registered.
 *
 * @param eventListeners - Event listeners map.
 * @param eventName - The name of the event to listen for.
 * @param beforeListenerId - The ID of the event listener before which to add this one.
 * @param listenerId - The ID of the listener which is being added.
 * @param callback - The  callback function.
 * @param once - When `true`, the listener is removed when triggered.
 */
export function addEventListenerBefore(
  eventListeners: EventListenerMap,
  eventName: string,
  beforeListenerId: string,
  listenerId: string,
  callback: EventListenerCallback,
  once = false,
): void {
  // If the listener is already registered for this event,
  // don't add it again.
  if (hasEventListener(eventListeners, eventName, listenerId)) {
    return;
  }

  // If the event is not registered, don't add the listener
  if (!eventListeners[eventName]) {
    return;
  }

  // Get the index of the 'before' listener
  const afterListenerIndex = eventListeners[eventName].listeners.findIndex(
    ({ id }) => id === beforeListenerId,
  );

  // If the 'before' listener is not registered, don't add the
  // listener.
  if (afterListenerIndex === -1) {
    return;
  }

  // Add the event listener to the position immediately before
  // the 'before' listener.
  eventListeners[eventName].listeners.splice(afterListenerIndex, 0, {
    id: listenerId,
    callback,
    once,
  });
}
