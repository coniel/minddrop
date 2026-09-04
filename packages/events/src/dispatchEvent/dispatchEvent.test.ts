import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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

// A catch-all event listener
const catchAllListener = {
  id: 'catch-all-listener',
  callback: vi.fn(),
};

let eventListeners: EventListenerMap;

const data = { foo: 'bar' };

describe('dispatchEvent', () => {
  beforeEach(() => {
    eventListeners = {
      'test-event': {
        listeners: [syncListener, asyncListener],
      },
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('calls registered listeners with the data and event name', async () => {
    await dispatchEvent(eventListeners, 'test-event', data);

    expect(syncListener.callback).toHaveBeenCalledWith(data, 'test-event');
    expect(asyncListener.callback).toHaveBeenCalledWith(data, 'test-event');
    expect(asyncFunction).toHaveBeenCalled();
  });

  it('calls catch-all listeners with the dispatched event name', async () => {
    eventListeners['*'] = { listeners: [catchAllListener] };

    await dispatchEvent(eventListeners, 'test-event', data);

    expect(catchAllListener.callback).toHaveBeenCalledWith(data, 'test-event');
  });

  describe('when a listener throws', () => {
    beforeEach(() => {
      // Keep the reported failure out of the test output
      vi.spyOn(console, 'error').mockImplementation(() => undefined);

      eventListeners['test-event'].listeners = [
        failingListener,
        syncListener,
        asyncListener,
      ];
    });

    afterEach(() => {
      vi.mocked(console.error).mockRestore();
    });

    it('does not fail the dispatch', async () => {
      await expect(
        dispatchEvent(eventListeners, 'test-event'),
      ).resolves.toBeUndefined();
    });

    it('calls the remaining listeners', async () => {
      await dispatchEvent(eventListeners, 'test-event');

      expect(syncListener.callback).toHaveBeenCalled();
      expect(asyncListener.callback).toHaveBeenCalled();
    });
  });
});
