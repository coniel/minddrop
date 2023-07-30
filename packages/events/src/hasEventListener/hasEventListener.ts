import { EventListenerMap } from '../types';

/**
 * Checks whether a listener with ID `listenerId` exists in the listeners array
 * for the event named `eventName`.
 *
 * @param eventListeners - Event listeners map.
 * @param eventName - The name of the event on which to check.
 * @param listenerId - The ID of the listener to check for.
 */
export function hasEventListener(
  eventListeners: EventListenerMap,
  eventName: string,
  listenerId: string,
): boolean {
  if (!eventListeners[eventName]) {
    // The event is not registered
    return false;
  }

  return !!eventListeners[eventName].listeners.find(
    ({ id }) => id === listenerId,
  );
}
