import { afterEach, describe, expect, it, vi } from 'vitest';
import { clearEventListeners, setEventListeners } from '../EventListenersStore';
import { TestFooEvent } from '../test-utils';
import { hasEventListener } from './hasEventListener';

describe('hasEventListener', () => {
  afterEach(() => {
    clearEventListeners();
  });

  it('returns `true` if the listener is registered', () => {
    // Add a listener 'test-listener' to the event
    setEventListeners(TestFooEvent, [
      { id: 'test-listener', callback: vi.fn() },
    ]);

    // Should find the listener
    expect(hasEventListener(TestFooEvent, 'test-listener')).toBe(true);
  });

  it('returns `false` if the event has no listeners', () => {
    // Check an event with no listeners
    expect(hasEventListener(TestFooEvent, 'test-listener')).toBe(false);
  });

  it('returns `false` if the listener is not registered', () => {
    // Add a listener 'foo' to the event
    setEventListeners(TestFooEvent, [{ id: 'foo', callback: vi.fn() }]);

    // Should not find 'test-listener'
    expect(hasEventListener(TestFooEvent, 'test-listener')).toBe(false);
  });
});
