import { appendEventLogEntry, removeEventLogEntry } from '../EventLogsStore';
import { trackPendingDispatch } from '../PendingDispatchesStore';
import { EventListener, EventListenerMap } from '../types';

// How long a listener may run before the dispatch is considered
// settled for event log purposes. A timed out listener keeps
// running; its late store updates repaint on their own.
const LISTENER_TIMEOUT_MS = 10000;

/**
 * Dispatches an event to the listeners registered for the event
 * named `eventName` and to the catch-all listeners.
 *
 * Dispatching is fire and forget: the event is logged to the
 * event log synchronously, every listener is queued to run on a
 * microtask, and nothing is awaited. The log entry is removed
 * once all listeners have settled or timed out, marking the
 * event's side effects as no longer in flight.
 *
 * A listener which throws or rejects is reported to the console
 * and does not affect the other listeners or the dispatching code.
 *
 * @param eventListeners - Event listeners map.
 * @param eventName - The name of the event.
 * @param data - The data associated with the event.
 */
export function dispatchEvent(
  eventListeners: EventListenerMap,
  eventName: string,
  data?: unknown,
): void {
  // Log the event before anything else, so no side effect can
  // land ahead of its entry
  const logEntryId = appendEventLogEntry(eventName, data);

  // The queued listeners' settlement promises
  const settled: Promise<void>[] = [];

  function queueListeners(listenerEventName: string): void {
    // Skip events with no registered listeners
    if (!eventListeners[listenerEventName]) {
      return;
    }

    // Freeze the listener list at dispatch time
    for (const listener of [...eventListeners[listenerEventName].listeners]) {
      settled.push(runListener(listener, eventName, data));
    }
  }

  queueListeners(eventName);

  // Also notify the catch-all ('*') listeners
  if (eventName !== '*') {
    queueListeners('*');
  }

  // Consider the dispatch settled after the timeout even if a
  // listener hangs, so the log entry cannot be pinned forever.
  const timeout = setTimeout(() => {
    removeEventLogEntry(logEntryId);
  }, LISTENER_TIMEOUT_MS);

  // Drop the log entry once every listener has settled
  const dispatchSettled = Promise.allSettled(settled).then(() => {
    clearTimeout(timeout);
    removeEventLogEntry(logEntryId);
  });

  // Track the dispatch until it settles
  trackPendingDispatch(dispatchSettled);
}

/**
 * Queues a listener to run on a microtask, so that dispatching
 * never blocks on listener work.
 *
 * @param listener - The listener to run.
 * @param eventName - The name of the dispatched event.
 * @param data - The dispatched event's data.
 * @returns A promise which resolves once the listener has settled.
 */
function runListener(
  listener: EventListener,
  eventName: string,
  data: unknown,
): Promise<void> {
  return new Promise((resolve) => {
    queueMicrotask(async () => {
      try {
        await listener.callback(data, eventName);
      } catch (error) {
        // A listener's failure is its own. The code which dispatched
        // the event has already done what the event reports and can
        // neither prevent nor recover from what a listener does with
        // it, so the failure is reported and the remaining listeners
        // run as usual
        console.error(
          `Event listener "${listener.id}" failed handling "${eventName}"`,
          error,
        );
      }

      resolve();
    });
  });
}
