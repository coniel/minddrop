import { clearEventListeners } from '../EventListenersStore';
import { clearEventLog } from '../EventLogsStore';
import {
  awaitPendingDispatches,
  hasPendingDispatches,
} from '../PendingDispatchesStore';

/**
 * Waits for pending dispatches to settle, then clears all event
 * listeners and the event log. Clears synchronously when no
 * dispatches are pending.
 *
 * **Intended for use in tests only!**
 *
 * @returns A promise which resolves once the listeners and log have been cleared.
 */
export function cleanupEvents(): Promise<void> {
  // Clear synchronously when nothing is in flight, so callers
  // which do not await still start their next test clean
  if (!hasPendingDispatches()) {
    clear();

    return Promise.resolve();
  }

  // Let the in-flight listeners settle before clearing
  return awaitPendingDispatches().then(clear);
}

/**
 * Clears the listeners and the event log.
 */
function clear(): void {
  clearEventListeners();
  clearEventLog();
}
