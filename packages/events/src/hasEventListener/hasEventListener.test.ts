import { describe, it, expect, vi } from 'vitest';
import { EventListenerMap } from '../types';
import { hasEventListener } from './hasEventListener';

describe('hasEventListener', () => {
  it('returns `true` if the listener is registered', () => {
    // Add a listener 'test-listener' to event 'test-event'
    const eventListeners: EventListenerMap = {
      'test-event': {
        listeners: [{ id: 'test-listener', callback: vi.fn() }],
      },
    };

    // Check if event 'test-envent' has a listener 'test-listener'.
    // Should return true.
    expect(
      hasEventListener(eventListeners, 'test-event', 'test-listener'),
    ).toBe(true);
  });

  it('returns `false` if the event is not registered', () => {
    // Check if an unregistered event has a listener
    // 'test-listener', should return false.
    expect(hasEventListener({}, 'test-event', 'test-listener')).toBe(false);
  });

  it('returns `false` if the listener is not registered', () => {
    // Add a listener 'foo' to event 'test-event'
    const eventListeners: EventListenerMap = {
      'test-event': {
        listeners: [{ id: 'foo', callback: vi.fn() }],
      },
    };

    // Check if event 'test-envent' has a listener 'test-listener'.
    // Should return false.
    expect(
      hasEventListener(eventListeners, 'test-event', 'test-listener'),
    ).toBe(false);
  });
});
