import { getEventListeners } from '../EventListenersStore';
import { EventName } from '../types';

/**
 * Checks whether a listener is registered for the event named
 * `eventName`, either a specific one or any at all.
 *
 * @param eventName - The name of the event on which to check.
 * @param listenerId - The ID of the listener to check for. Omit to check for any listener.
 * @returns Whether the listener is registered.
 */
export function hasEventListener(
  eventName: EventName,
  listenerId?: string,
): boolean {
  const listeners = getEventListeners(eventName);

  // Without an ID, any listener answers the question
  if (!listenerId) {
    return listeners.length > 0;
  }

  return listeners.some(({ id }) => id === listenerId);
}
