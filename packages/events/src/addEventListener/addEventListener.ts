import { getEventListeners, setEventListeners } from '../EventListenersStore';
import { hasEventListener } from '../hasEventListener';
import { EventData, EventListenerCallback, EventName } from '../types';

/**
 * Adds a listener for the event named `eventName`.
 *
 * Does not add the listener if a listener with the same ID is already
 * registered for the event. The same ID may listen for other events.
 *
 * @param eventName - The name of the event to listen for.
 * @param listenerId - The ID of the listener which is being added.
 * @param callback - The callback function.
 * @param once - When `true`, the listener is removed when triggered.
 */
export function addEventListener<TEvent extends EventName>(
  eventName: TEvent,
  listenerId: string,
  callback: EventListenerCallback<EventData<TEvent>>,
  once = false,
): void {
  // If the listener is already registered for this event,
  // don't add it again.
  if (hasEventListener(eventName, listenerId)) {
    return;
  }

  // The store holds listeners of every event, so it cannot type
  // the callback on the event's data.
  setEventListeners(eventName, [
    ...getEventListeners(eventName),
    { id: listenerId, callback: callback as EventListenerCallback, once },
  ]);
}
