import { EventListenerMap } from '../types';

/**
 * Synchronously calls each of the listeners registered for the event named `eventName`,
 * in the order they were registered, passing the supplied arguments to each.
 *
 * Asynchronously calls each of the side effects registered for the event named `eventName`,
 * passing the supplied arguments to each.
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
      await listener.callback({
        name: eventName,
        stopPropagation,
        skipPropagation,
        data,
      });
    }
  }

  await runListeners(eventName);

  // Also notify catch-all ('*') listeners, with their own propagation context.
  if (eventName !== '*') {
    await runListeners('*');
  }
}
