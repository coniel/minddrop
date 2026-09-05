import { EventData, EventName, Events } from '@minddrop/events';

/**
 * Dispatches an event using a name and data supplied at runtime.
 *
 * @param name - The name to dispatch the event under.
 * @param data - The data to dispatch the event with.
 */
export function dispatchDynamicEvent(name: string, data?: unknown): void {
  // The dev tools dispatch names typed by the user, which the event
  // registry cannot check
  Events.dispatch(name as EventName, data as EventData<EventName>);
}
