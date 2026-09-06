import { EventListener } from '../types';

// The registered listeners keyed by event name
let listeners: Record<string, EventListener[]> = {};

/**
 * Retrieves the listeners registered for an event.
 *
 * @param eventName - The name of the event.
 * @returns The event's listeners.
 */
export function getEventListeners(eventName: string): EventListener[] {
  return listeners[eventName] || [];
}

/**
 * Replaces the listeners registered for an event.
 *
 * @param eventName - The name of the event.
 * @param eventListeners - The event's new listeners.
 */
export function setEventListeners(
  eventName: string,
  eventListeners: EventListener[],
): void {
  listeners = { ...listeners, [eventName]: eventListeners };
}

/**
 * Removes every registered listener.
 *
 * **Intended for use in tests only!**
 */
export function clearEventListeners(): void {
  listeners = {};
}
