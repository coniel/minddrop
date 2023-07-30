import { describe, beforeEach, it, expect, vi } from 'vitest';
import { prependEventListener } from './prependEventListener';
import { EventListener, EventListenerMap } from '../types';

describe('prependEventListener', () => {
  let eventsListeners: EventListenerMap = {};
  const callback = vi.fn();
  const eventListener: EventListener = {
    id: 'test-listener',
    callback,
    once: false,
  };

  beforeEach(() => {
    eventsListeners = {};
  });

  it('adds listener for new event', () => {
    // Add a listener for 'test-event' which is not yet registered
    prependEventListener(
      eventsListeners,
      'test-event',
      'test-listener',
      callback,
    );

    // Should register 'test-event' with the listener
    expect(eventsListeners).toEqual({
      'test-event': { listeners: [eventListener] },
    });
  });

  it('prepends listener for existing event', () => {
    // Add an existing listener for 'test-event'
    const existingListener = { ...eventListener, id: 'foo' };
    eventsListeners['test-event'] = {
      listeners: [existingListener],
    };

    // Prepend a new listener for 'test-event'
    prependEventListener(
      eventsListeners,
      'test-event',
      'test-listener',
      callback,
    );

    // Should have both event listeners, with the prepended
    // one in first position.
    expect(eventsListeners).toEqual({
      'test-event': {
        listeners: [eventListener, existingListener],
      },
    });
  });

  it('sets `once` value', () => {
    // Add a one time listener for 'test-event'
    prependEventListener(
      eventsListeners,
      'test-event',
      'test-listener',
      callback,
      true,
    );

    // Should set 'once' to true
    expect(eventsListeners).toEqual({
      'test-event': {
        listeners: [{ ...eventListener, once: true }],
      },
    });
  });

  it('does not add a duplicate listener', () => {
    // Add an existing listener 'test-listener' for 'test-event'
    const existingListener = { ...eventListener, id: 'test-listener' };
    eventsListeners['test-event'] = {
      listeners: [existingListener],
    };

    // Attempt to prepend listener 'test-listener'
    prependEventListener(
      eventsListeners,
      'test-event',
      'test-listener',
      callback,
    );

    // Should not add a second 'test-listener'
    expect(eventsListeners).toEqual({
      'test-event': {
        listeners: [existingListener],
      },
    });
  });
});
