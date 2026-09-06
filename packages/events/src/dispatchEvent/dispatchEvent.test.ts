import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clearEventListeners, setEventListeners } from '../EventListenersStore';
import { clearEventLog, getEventLogEntries } from '../EventLogsStore';
import { TestBarEvent, TestFooEvent } from '../test-utils';
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

const data = { foo: 'bar' };

// Resolves once queued listener microtasks have run
function flushMicrotasks(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve);
  });
}

describe('dispatchEvent', () => {
  beforeEach(() => {
    setEventListeners(TestFooEvent, [syncListener, asyncListener]);
  });

  afterEach(() => {
    clearEventListeners();
    clearEventLog();
    vi.clearAllMocks();
  });

  it('calls registered listeners with the data and event name', async () => {
    dispatchEvent(TestFooEvent, data);

    await flushMicrotasks();

    expect(syncListener.callback).toHaveBeenCalledWith(data, TestFooEvent);
    expect(asyncListener.callback).toHaveBeenCalledWith(data, TestFooEvent);
  });

  it('does not run listeners synchronously', () => {
    dispatchEvent(TestFooEvent, data);

    // The listeners are queued rather than run during the dispatch
    expect(syncListener.callback).not.toHaveBeenCalled();
  });

  it('calls catch-all listeners with the dispatched event name', async () => {
    setEventListeners('*', [catchAllListener]);

    dispatchEvent(TestFooEvent, data);

    await flushMicrotasks();

    expect(catchAllListener.callback).toHaveBeenCalledWith(data, TestFooEvent);
  });

  it('logs the event synchronously', () => {
    dispatchEvent(TestFooEvent, data);

    expect(getEventLogEntries(TestFooEvent)).toEqual([
      expect.objectContaining({ name: TestFooEvent, data }),
    ]);
  });

  it('removes the log entry once the listeners have settled', async () => {
    dispatchEvent(TestFooEvent, data);

    await vi.waitFor(() => {
      expect(getEventLogEntries(TestFooEvent)).toEqual([]);
    });
  });

  it('removes the log entry when the event has no listeners', async () => {
    dispatchEvent(TestBarEvent, data);

    await vi.waitFor(() => {
      expect(getEventLogEntries(TestBarEvent)).toEqual([]);
    });
  });

  it('removes the log entry when a listener times out', async () => {
    vi.useFakeTimers();

    // A listener which never settles
    setEventListeners(TestFooEvent, [
      { id: 'hung-listener', callback: () => new Promise(() => {}) },
    ]);

    dispatchEvent(TestFooEvent, data);

    // Run the queued listener and the timeout
    await vi.advanceTimersByTimeAsync(10000);

    expect(getEventLogEntries(TestFooEvent)).toEqual([]);

    vi.useRealTimers();
  });

  describe('when a listener throws', () => {
    beforeEach(() => {
      // Keep the reported failure out of the test output
      vi.spyOn(console, 'error').mockImplementation(() => undefined);

      setEventListeners(TestFooEvent, [
        failingListener,
        rejectingListener,
        syncListener,
        asyncListener,
      ]);
    });

    afterEach(() => {
      vi.mocked(console.error).mockRestore();
    });

    it('does not fail the dispatch', () => {
      expect(() => dispatchEvent(TestFooEvent)).not.toThrow();
    });

    it('calls the remaining listeners', async () => {
      dispatchEvent(TestFooEvent);

      await flushMicrotasks();

      expect(syncListener.callback).toHaveBeenCalled();
      expect(asyncListener.callback).toHaveBeenCalled();
    });

    it('reports listener failures', async () => {
      dispatchEvent(TestFooEvent);

      await flushMicrotasks();

      expect(console.error).toHaveBeenCalledWith(
        `Event listener "failing-listener" failed handling "${TestFooEvent}"`,
        expect.any(Error),
      );
      expect(console.error).toHaveBeenCalledWith(
        `Event listener "rejecting-listener" failed handling "${TestFooEvent}"`,
        expect.any(Error),
      );
    });

    it('removes the log entry once the listeners have settled', async () => {
      dispatchEvent(TestFooEvent);

      await vi.waitFor(() => {
        expect(getEventLogEntries(TestFooEvent)).toEqual([]);
      });
    });
  });
});
