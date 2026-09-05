import { EventLogEntry } from '../types';

// The logged events, replaced immutably so that snapshots can be
// compared by reference.
let entries: EventLogEntry[] = [];

// Callbacks notified when the entries change
const subscribers = new Set<() => void>();

// Source of the entry IDs
let nextEntryId = 0;

/**
 * Appends a dispatched event to the log.
 *
 * @param name - The dispatched event's name.
 * @param data - The dispatched event's data.
 * @returns The ID of the appended entry.
 */
export function appendEventLogEntry(name: string, data: unknown): number {
  nextEntryId += 1;

  entries = [
    ...entries,
    { id: nextEntryId, name, data, timestamp: new Date() },
  ];

  notifySubscribers();

  return nextEntryId;
}

/**
 * Removes an entry from the log. Removing an already removed
 * entry does nothing.
 *
 * @param id - The ID of the entry to remove.
 */
export function removeEventLogEntry(id: number): void {
  // Check that the entry is still in the log
  if (!entries.some((entry) => entry.id === id)) {
    return;
  }

  entries = entries.filter((entry) => entry.id !== id);

  notifySubscribers();
}

/**
 * Retrieves the log's entries, most recent last.
 *
 * @param name - The event name to filter for. Omit to retrieve every entry.
 * @returns The matching log entries.
 */
export function getEventLogEntries(name?: string): EventLogEntry[] {
  // Return the stable snapshot when no name is given
  if (name === undefined) {
    return entries;
  }

  return entries.filter((entry) => entry.name === name);
}

/**
 * Subscribes to log changes.
 *
 * @param subscriber - Called whenever the log's entries change.
 * @returns A function which removes the subscription.
 */
export function subscribeToEventLog(subscriber: () => void): () => void {
  subscribers.add(subscriber);

  return () => {
    subscribers.delete(subscriber);
  };
}

/**
 * Empties the log.
 *
 * **Intended for use in tests only!**
 */
export function clearEventLog(): void {
  entries = [];

  notifySubscribers();
}

/**
 * Notifies the subscribers of an entries change.
 */
function notifySubscribers(): void {
  subscribers.forEach((subscriber) => {
    subscriber();
  });
}
