import { EventData, EventName, Events } from '@minddrop/events';

/**
 * Dispatches an event using a name and data supplied at runtime.
 *
 * @param name - The name to dispatch the event under.
 * @param data - The data to dispatch the event with.
 * @returns A promise which resolves once the event's listeners have run.
 */
export function dispatchDynamicEvent(
  name: string,
  data?: unknown,
): Promise<void> {
  // The dev tools dispatch names typed by the user, which the event
  // registry cannot check
  return Events.dispatch(name as EventName, data as EventData<EventName>);
}
