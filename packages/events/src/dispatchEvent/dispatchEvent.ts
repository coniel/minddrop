import { EventListenerMap } from '../types';

/**
 * Calls each of the listeners registered for the event named
 * `eventName` in the order they were registered, passing the event
 * data and name to each, then does the same for the catch-all
 * listeners.
 *
 * A listener which throws is reported to the console and does not
 * affect the other listeners or the dispatching code.
 *
 * @param eventListeners - Event listeners map.
 * @param eventName - The name of the event.
 * @param data - The data associated with the event.
 */
export async function dispatchEvent(
  eventListeners: EventListenerMap,
  eventName: string,
  data?: unknown,
): Promise<void> {
  async function runListeners(listenerEventName: string): Promise<void> {
    // Skip events with no registered listeners
    if (!eventListeners[listenerEventName]) {
      return;
    }

    for (const listener of eventListeners[listenerEventName].listeners) {
      try {
        await listener.callback(data, eventName);
      } catch (error) {
        // A listener's failure is its own. The code which dispatched
        // the event has already done what the event reports and can
        // neither prevent nor recover from what a listener does with
        // it, so the failure is reported and the remaining listeners
        // are called as usual
        console.error(
          `Event listener "${listener.id}" failed handling "${eventName}"`,
          error,
        );
      }
    }
  }

  await runListeners(eventName);

  // Also notify the catch-all ('*') listeners
  if (eventName !== '*') {
    await runListeners('*');
  }
}
