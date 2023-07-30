import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { dispatchEvent } from './dispatchEvent';
import { Event, EventListener, EventListenerMap } from '../types';

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

// An event listener that stops propagation
const stopPropagationListener = {
  id: 'stop-propagation-listener',
  callback: vi
    .fn()
    .mockImplementation((event: Event) => event.stopPropagation()),
};

// An event listener that skips propagation to 'sync-listener'
const skipPropagationListener = {
  id: 'stop-propagation-listener',
  callback: vi
    .fn()
    .mockImplementation((event: Event) =>
      event.skipPropagation(syncListener.id),
    ),
};

// An event listener that skips propagation to 'sync-listener'
// and 'async-listener'.
const multiSkipPropagationListener = {
  id: 'multi-stop-propagation-listener',
  callback: vi
    .fn()
    .mockImplementation((event: Event) =>
      event.skipPropagation([syncListener.id, asyncListener.id]),
    ),
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

  it('synchrounously calls registered listeners for the event', async () => {
    const event = {
      name: 'test-event',
      data,
      stopPropagation: expect.any(Function),
      skipPropagation: expect.any(Function),
    };

    await dispatchEvent(eventListeners, 'test-event', data);

    expect(syncListener.callback.mock.calls[0][0]).toEqual(event);
    expect(asyncListener.callback.mock.calls[0][0]).toEqual(event);
    expect(asyncFunction).toHaveBeenCalled();
  });

  it('stops propagation', async () => {
    // Register 'stopPropagationListener' before 'syncListener'
    eventListeners['test-event'].listeners = [
      stopPropagationListener,
      syncListener,
    ];

    // Dispatch a 'test-event'
    await dispatchEvent(eventListeners, 'test-event');

    // Should call 'stopPropagationListener' but not 'synListener'
    expect(stopPropagationListener.callback).toHaveBeenCalled();
    expect(syncListener.callback).not.toHaveBeenCalled();
  });

  it('skips a listener', async () => {
    // Register 'skipPropagationListener' before 'syncListener'
    // and 'asyncListener'
    eventListeners['test-event'].listeners = [
      skipPropagationListener,
      syncListener,
      asyncListener,
    ];

    // Dispatch a 'test-event'
    await dispatchEvent(eventListeners, 'test-event');

    // Should call 'skipPropagationListener' and 'asyncListener',
    // but not 'synListener'
    expect(skipPropagationListener.callback).toHaveBeenCalled();
    expect(asyncListener.callback).toHaveBeenCalled();
    expect(syncListener.callback).not.toHaveBeenCalled();
  });

  it('skips multiple listeners', async () => {
    // Register 'multiSkipPropagationListener' before 'syncListener'
    // and 'asyncListener'
    eventListeners['test-event'].listeners = [
      multiSkipPropagationListener,
      syncListener,
      asyncListener,
    ];

    // Dispatch a 'test-event'
    await dispatchEvent(eventListeners, 'test-event');

    // Should call 'multiSkipPropagationListener' but not
    // 'asyncListener' or 'synListener'
    expect(multiSkipPropagationListener.callback).toHaveBeenCalled();
    expect(asyncListener.callback).not.toHaveBeenCalled();
    expect(syncListener.callback).not.toHaveBeenCalled();
  });
});
