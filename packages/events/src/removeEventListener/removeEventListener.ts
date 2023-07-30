import { EventListenerMap } from '../types';

/**
 * Removes the listener with ID `listenerId` from the listeners array for the
 * event named `eventName`.
 *
 * @param eventListeners - Event listeners map.
 * @param eventName - The name of the event from which to remove the listener.
 * @param listenerId - The ID of the listener to remove.
 */
export function removeEventListener(
  eventListeners: EventListenerMap,
  eventName: string,
  listenerId: string,
): void {
  if (!eventListeners[eventName]) {
    // Event is not registered
    return;
  }

  // Filter out the target listener
  eventListeners[eventName].listeners = eventListeners[
    eventName
  ].listeners.filter(({ id }) => id !== listenerId);
}
