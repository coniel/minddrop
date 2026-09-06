import { getEventListeners, setEventListeners } from '../EventListenersStore';
import { EventName } from '../types';

/**
 * Removes the listener with ID `listenerId` from the event named
 * `eventName`.
 *
 * @param eventName - The name of the event from which to remove the listener.
 * @param listenerId - The ID of the listener to remove.
 */
export function removeEventListener(
  eventName: EventName,
  listenerId: string,
): void {
  setEventListeners(
    eventName,
    getEventListeners(eventName).filter(({ id }) => id !== listenerId),
  );
}
