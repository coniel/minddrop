import { EventListenerMap } from '../types';

/**
 * Synchronously calls each of the listeners registered for the event named `eventName`,
 * in the order they were registered, passing the supplied arguments to each.
 *
 * Asynchronously calls each of the side effects registered for the event named `eventName`,
 * passing the supplied arguments to each.
 *
 * A listener which throws is reported to the console and does not
 * affect the other listeners or the dispatching code.
 *
 * @param eventName - The name of the event.
 * @param data - The data associated with the event.
 */
export async function dispatchEvent(
  eventListeners: EventListenerMap,
  eventName: string,
  data?: unknown,
): Promise<void> {
  async function runListeners(listenerEventName: string): Promise<void> {
    if (!eventListeners[listenerEventName]) {
      return;
    }

    let propagationStopped = false;
    const skipListeners: string[] = [];

    function stopPropagation() {
      propagationStopped = true;
    }

    function skipPropagation(listenerId: string | string[]) {
      if (Array.isArray(listenerId)) {
        skipListeners.push(...listenerId);
      } else {
        skipListeners.push(listenerId);
      }
    }

    for (const listener of eventListeners[listenerEventName].listeners) {
      if (propagationStopped) {
        break;
      }

      if (skipListeners.includes(listener.id)) {
        continue;
      }

      try {
        await listener.callback({
          name: eventName,
          stopPropagation,
          skipPropagation,
          data,
        });
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

  // Also notify catch-all ('*') listeners, with their own propagation context.
  if (eventName !== '*') {
    await runListeners('*');
  }
}
