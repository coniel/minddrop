import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clearEventLog, getEventLogEntries } from '../EventLogsStore';
import { EventListenerMap } from '../types';
import { dispatchEvent } from './dispatchEvent';

const asyncFunction = vi.fn();

// A simple event listener
const syncListener = {
  id: 'sync-listener',
  callback: vi.fn(),
};

// An event listener with an asynchronous callback
const asyncListener = {
  id: 'async-listener',
  callback: vi.fn().mockImplementation(
    () =>
      new Promise((resolve) => {
        setTimeout(() => {
          asyncFunction();
          resolve(null);
        });
      }),
  ),
};

// An event listener whose callback throws
const failingListener = {
  id: 'failing-listener',
  callback: vi.fn().mockImplementation(() => {
    throw new Error('Listener failed');
  }),
};

// An event listener whose callback rejects
const rejectingListener = {
  id: 'rejecting-listener',
  callback: vi.fn().mockRejectedValue(new Error('Listener rejected')),
};

// A catch-all event listener
const catchAllListener = {
  id: 'catch-all-listener',
  callback: vi.fn(),
};

let eventListeners: EventListenerMap;

const data = { foo: 'bar' };

// Resolves once queued listener microtasks have run
function flushMicrotasks(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve);
  });
}

describe('dispatchEvent', () => {
  beforeEach(() => {
    eventListeners = {
      'test-event': {
        listeners: [syncListener, asyncListener],
      },
    };
  });

  afterEach(() => {
    clearEventLog();
    vi.clearAllMocks();
  });

  it('calls registered listeners with the data and event name', async () => {
    dispatchEvent(eventListeners, 'test-event', data);

    await flushMicrotasks();

    expect(syncListener.callback).toHaveBeenCalledWith(data, 'test-event');
    expect(asyncListener.callback).toHaveBeenCalledWith(data, 'test-event');
  });

  it('does not run listeners synchronously', () => {
    dispatchEvent(eventListeners, 'test-event', data);

    // The listeners are queued rather than run during the dispatch
    expect(syncListener.callback).not.toHaveBeenCalled();
  });

  it('calls catch-all listeners with the dispatched event name', async () => {
    eventListeners['*'] = { listeners: [catchAllListener] };

    dispatchEvent(eventListeners, 'test-event', data);

    await flushMicrotasks();

    expect(catchAllListener.callback).toHaveBeenCalledWith(data, 'test-event');
  });

  it('logs the event synchronously', () => {
    dispatchEvent(eventListeners, 'test-event', data);

    expect(getEventLogEntries('test-event')).toEqual([
      expect.objectContaining({ name: 'test-event', data }),
    ]);
  });

  it('removes the log entry once the listeners have settled', async () => {
    dispatchEvent(eventListeners, 'test-event', data);

    await vi.waitFor(() => {
      expect(getEventLogEntries('test-event')).toEqual([]);
    });
  });

  it('removes the log entry when the event has no listeners', async () => {
    dispatchEvent(eventListeners, 'unheard-event', data);

    await vi.waitFor(() => {
      expect(getEventLogEntries('unheard-event')).toEqual([]);
    });
  });

  it('removes the log entry when a listener times out', async () => {
    vi.useFakeTimers();

    // A listener which never settles
    eventListeners['test-event'].listeners = [
      { id: 'hung-listener', callback: () => new Promise(() => {}) },
    ];

    dispatchEvent(eventListeners, 'test-event', data);

    // Run the queued listener and the timeout
    await vi.advanceTimersByTimeAsync(10000);

    expect(getEventLogEntries('test-event')).toEqual([]);

    vi.useRealTimers();
  });

  describe('when a listener throws', () => {
    beforeEach(() => {
      // Keep the reported failure out of the test output
      vi.spyOn(console, 'error').mockImplementation(() => undefined);

      eventListeners['test-event'].listeners = [
        failingListener,
        rejectingListener,
        syncListener,
        asyncListener,
      ];
    });

    afterEach(() => {
      vi.mocked(console.error).mockRestore();
    });

    it('does not fail the dispatch', () => {
      expect(() => dispatchEvent(eventListeners, 'test-event')).not.toThrow();
    });

    it('calls the remaining listeners', async () => {
      dispatchEvent(eventListeners, 'test-event');

      await flushMicrotasks();

      expect(syncListener.callback).toHaveBeenCalled();
      expect(asyncListener.callback).toHaveBeenCalled();
    });

    it('reports listener failures', async () => {
      dispatchEvent(eventListeners, 'test-event');

      await flushMicrotasks();

      expect(console.error).toHaveBeenCalledWith(
        'Event listener "failing-listener" failed handling "test-event"',
        expect.any(Error),
      );
      expect(console.error).toHaveBeenCalledWith(
        'Event listener "rejecting-listener" failed handling "test-event"',
        expect.any(Error),
      );
    });

    it('removes the log entry once the listeners have settled', async () => {
      dispatchEvent(eventListeners, 'test-event');

      await vi.waitFor(() => {
        expect(getEventLogEntries('test-event')).toEqual([]);
      });
    });
  });
});
