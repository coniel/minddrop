import { describe, it, expect, vi } from 'vitest';
import { EventListenerMap } from '../types';
import { removeEventListener } from './removeEventListener';

describe('removeEventListener', () => {
  it('removes the event listeners', () => {
    // Add a listener 'test-listener' to 'test-event'
    const eventListeners: EventListenerMap = {
      'test-event': { listeners: [{ id: 'test-listener', callback: vi.fn() }] },
    };

    // Remove listener 'test-listener' from 'test-event'
    removeEventListener(eventListeners, 'test-event', 'test-listener');

    // Should remove the listener
    expect(eventListeners['test-event'].listeners).toEqual([]);
  });

  it('does nothing if the event is not registered', () => {
    const eventListeners = {};

    // Remove listener 'test-listener' from 'test-event',
    // which is not registered.
    removeEventListener(eventListeners, 'test-event', 'test-listener');

    // Should remove the listener
    expect(eventListeners).toEqual({});
  });
});
