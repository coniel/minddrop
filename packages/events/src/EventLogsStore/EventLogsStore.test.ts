import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  appendEventLogEntry,
  clearEventLog,
  getEventLogEntries,
  removeEventLogEntry,
  subscribeToEventLog,
} from './EventLogsStore';

describe('EventLogsStore', () => {
  afterEach(clearEventLog);

  it('appends entries with the event name and data', () => {
    appendEventLogEntry('test-event', { value: 1 });

    expect(getEventLogEntries()).toEqual([
      expect.objectContaining({ name: 'test-event', data: { value: 1 } }),
    ]);
  });

  it('filters entries by event name', () => {
    appendEventLogEntry('test-event', { value: 1 });
    appendEventLogEntry('other-event', { value: 2 });

    expect(getEventLogEntries('other-event')).toEqual([
      expect.objectContaining({ name: 'other-event' }),
    ]);
  });

  it('removes entries by ID', () => {
    const id = appendEventLogEntry('test-event', { value: 1 });
    appendEventLogEntry('test-event', { value: 2 });

    removeEventLogEntry(id);

    expect(getEventLogEntries('test-event')).toEqual([
      expect.objectContaining({ data: { value: 2 } }),
    ]);
  });

  it('ignores removals of already removed entries', () => {
    const id = appendEventLogEntry('test-event', { value: 1 });

    removeEventLogEntry(id);

    expect(() => removeEventLogEntry(id)).not.toThrow();
  });

  it('notifies subscribers of entry changes', () => {
    const subscriber = vi.fn();

    subscribeToEventLog(subscriber);
    const id = appendEventLogEntry('test-event', { value: 1 });

    expect(subscriber).toHaveBeenCalledTimes(1);

    removeEventLogEntry(id);

    expect(subscriber).toHaveBeenCalledTimes(2);
  });

  it('does not notify a subscriber of an untouched log', () => {
    const subscriber = vi.fn();
    const id = appendEventLogEntry('test-event', { value: 1 });

    removeEventLogEntry(id);
    subscribeToEventLog(subscriber);

    // Removing an already removed entry changes nothing
    removeEventLogEntry(id);

    expect(subscriber).not.toHaveBeenCalled();
  });

  it('stops notifying unsubscribed subscribers', () => {
    const subscriber = vi.fn();

    const unsubscribe = subscribeToEventLog(subscriber);
    unsubscribe();

    appendEventLogEntry('test-event', { value: 1 });

    expect(subscriber).not.toHaveBeenCalled();
  });

  it('keeps the snapshot reference stable between changes', () => {
    appendEventLogEntry('test-event', { value: 1 });

    expect(getEventLogEntries()).toBe(getEventLogEntries());
  });
});
