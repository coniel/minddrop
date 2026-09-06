import { getEventListeners } from '../EventListenersStore';
import { EventName } from '../types';

/**
 * Checks whether a listener with ID `listenerId` is registered for
 * the event named `eventName`.
 *
 * @param eventName - The name of the event on which to check.
 * @param listenerId - The ID of the listener to check for.
 * @returns Whether the listener is registered.
 */
export function hasEventListener(
  eventName: EventName,
  listenerId: string,
): boolean {
  return getEventListeners(eventName).some(({ id }) => id === listenerId);
}
