import { describe, beforeEach, it, expect, vi } from 'vitest';
import { addEventListener } from './addEventListener';
import { EventListener, EventListenerMap } from '../types';

describe('addEventListener', () => {
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
    addEventListener(eventsListeners, 'test-event', 'test-listener', callback);

    // Should register 'test-event' with the listener
    expect(eventsListeners).toEqual({
      'test-event': { listeners: [eventListener] },
    });
  });

  it('adds listener for existing event', () => {
    // Add an existing listener for 'test-event'
    const existingListener = { ...eventListener, id: 'foo' };
    eventsListeners['test-event'] = {
      listeners: [existingListener],
    };

    // Add a new listener for 'test-event'
    addEventListener(eventsListeners, 'test-event', 'test-listener', callback);

    // Should have both event listeners
    expect(eventsListeners).toEqual({
      'test-event': {
        listeners: [existingListener, eventListener],
      },
    });
  });

  it('sets `once` value', () => {
    // Add a one time listener for 'test-event'
    addEventListener(
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

  it('does not add a duplicate event listener', () => {
    // Add an existing 'foo' listener for 'test-event'
    const existingListener = { ...eventListener, id: 'foo' };
    eventsListeners['test-event'] = {
      listeners: [existingListener],
    };

    // Attempt to add listener 'foo' again
    addEventListener(eventsListeners, 'test-event', 'foo', callback);

    // Should not add 'foo' listener again
    expect(eventsListeners).toEqual({
      'test-event': {
        listeners: [existingListener],
      },
    });
  });
});
