import { DevToolsEventsStore } from '../DevToolsEventsStore';
import { MaxEventEntries } from '../constants';

// Captured events are disposable, so a counter is enough to tell
// them apart within a session
let eventCount = 0;

/**
 * Adds a dispatched event to the captured events, dropping the
 * oldest entries once the maximum is exceeded.
 *
 * @param name - The name the event was dispatched under.
 * @param data - The data the event was dispatched with.
 */
export function addDevToolsEvent(name: string, data: unknown): void {
  eventCount += 1;

  DevToolsEventsStore.add({
    id: `event_${eventCount}`,
    name,
    data,
    timestamp: Date.now(),
  });

  const entries = DevToolsEventsStore.getAll();
  const overflow = Math.max(entries.length - MaxEventEntries, 0);

  // Drop the oldest entries which no longer fit
  entries.slice(0, overflow).forEach((entry) => {
    DevToolsEventsStore.remove(entry.id);
  });
}
