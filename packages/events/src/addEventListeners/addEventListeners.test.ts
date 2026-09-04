import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EventListenerMap } from '../types';
import { addEventListeners } from './addEventListeners';

describe('addEventListeners', () => {
  let eventsListeners: EventListenerMap = {};
  const fooCallback = vi.fn();
  const barCallback = vi.fn();

  beforeEach(() => {
    eventsListeners = {};
  });

  it('adds a listener for each event under the same ID', () => {
    // Add listeners for two events at once
    addEventListeners(eventsListeners, 'test-listener', {
      'foo-event': fooCallback,
      'bar-event': barCallback,
    });

    // Should register both events with the listener
    expect(eventsListeners).toEqual({
      'foo-event': {
        listeners: [
          { id: 'test-listener', callback: fooCallback, once: false },
        ],
      },
      'bar-event': {
        listeners: [
          { id: 'test-listener', callback: barCallback, once: false },
        ],
      },
    });
  });

  it('skips events without a callback', () => {
    // Add listeners with one event left undefined
    addEventListeners(eventsListeners, 'test-listener', {
      'foo-event': fooCallback,
      'bar-event': undefined,
    });

    // Should only register the event with a callback
    expect(Object.keys(eventsListeners)).toEqual(['foo-event']);
  });

  it('does not add duplicate event listeners', () => {
    // Add an existing 'test-listener' listener for 'foo-event'
    const existingListener = {
      id: 'test-listener',
      callback: vi.fn(),
      once: false,
    };
    eventsListeners['foo-event'] = { listeners: [existingListener] };

    // Attempt to add 'test-listener' again for both events
    addEventListeners(eventsListeners, 'test-listener', {
      'foo-event': fooCallback,
      'bar-event': barCallback,
    });

    // Should keep the existing listener and add only the new event
    expect(eventsListeners).toEqual({
      'foo-event': { listeners: [existingListener] },
      'bar-event': {
        listeners: [
          { id: 'test-listener', callback: barCallback, once: false },
        ],
      },
    });
  });
});
