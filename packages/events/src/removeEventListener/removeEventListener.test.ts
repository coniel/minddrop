import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  clearEventListeners,
  getEventListeners,
  setEventListeners,
} from '../EventListenersStore';
import { TestFooEvent } from '../test-utils';
import { removeEventListener } from './removeEventListener';

describe('removeEventListener', () => {
  afterEach(() => {
    clearEventListeners();
  });

  it('removes the event listener', () => {
    // Add listeners 'test-listener' and 'other' to the event
    const otherListener = { id: 'other', callback: vi.fn() };
    setEventListeners(TestFooEvent, [
      { id: 'test-listener', callback: vi.fn() },
      otherListener,
    ]);

    // Remove listener 'test-listener' from the event
    removeEventListener(TestFooEvent, 'test-listener');

    // Should remove only the target listener
    expect(getEventListeners(TestFooEvent)).toEqual([otherListener]);
  });

  it('does nothing if the event has no listeners', () => {
    // Remove a listener from an event with no listeners
    removeEventListener(TestFooEvent, 'test-listener');

    // Should leave the event without listeners
    expect(getEventListeners(TestFooEvent)).toEqual([]);
  });
});
