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
  // If no listeners are registered for the event, stop here
  if (!eventListeners[eventName]) {
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

  for (const listener of eventListeners[eventName].listeners) {
    if (propagationStopped) {
      // stopPropagation() was called by the previous listener
      // so we break the loop.
      break;
    }

    if (skipListeners.includes(listener.id)) {
      // A previous listener called skipPropagation on this
      // listener so we skip it.
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
