import { useMemo, useSyncExternalStore } from 'react';
import { getEventLogEntries, subscribeToEventLog } from './EventLogsStore';
import { EventData, EventLogEntry, EventName } from './types';

/**
 * Tracks the dispatched events of a type whose side effects are
 * in flight.
 *
 * @param eventName - The name of the event to track.
 * @returns The event's in-flight log entries, most recent last.
 */
export function useEventLogEntries<TEvent extends EventName>(
  eventName: TEvent,
): EventLogEntry<EventData<TEvent>>[] {
  // Subscribe to the log's stable entries snapshot
  const entries = useSyncExternalStore(subscribeToEventLog, () =>
    getEventLogEntries(),
  );

  // Filter for the tracked event. The registry cannot type the
  // heterogeneous log, so the matched entries are cast to the
  // event's data type.
  return useMemo(
    () =>
      entries.filter((entry) => entry.name === eventName) as EventLogEntry<
        EventData<TEvent>
      >[],
    [entries, eventName],
  );
}
