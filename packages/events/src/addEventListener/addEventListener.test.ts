import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  clearEventListeners,
  getEventListeners,
  setEventListeners,
} from '../EventListenersStore';
import { TestFooEvent } from '../test-utils';
import { EventListener } from '../types';
import { addEventListener } from './addEventListener';

const callback = vi.fn();
const eventListener: EventListener = {
  id: 'test-listener',
  callback,
  once: false,
};

describe('addEventListener', () => {
  afterEach(() => {
    clearEventListeners();
  });

  it('adds listener for new event', () => {
    // Add a listener for an event with no listeners yet
    addEventListener(TestFooEvent, 'test-listener', callback);

    // Should register the event with the listener
    expect(getEventListeners(TestFooEvent)).toEqual([eventListener]);
  });

  it('adds listener for existing event', () => {
    // Add an existing listener for the event
    const existingListener = { ...eventListener, id: 'foo' };
    setEventListeners(TestFooEvent, [existingListener]);

    // Add a new listener for the event
    addEventListener(TestFooEvent, 'test-listener', callback);

    // Should have both event listeners
    expect(getEventListeners(TestFooEvent)).toEqual([
      existingListener,
      eventListener,
    ]);
  });

  it('does not add duplicate event listeners', () => {
    // Add an existing 'test-listener' listener for the event
    setEventListeners(TestFooEvent, [eventListener]);

    // Attempt to add 'test-listener' again
    addEventListener(TestFooEvent, 'test-listener', callback);

    // Should not have added the listener a second time
    expect(getEventListeners(TestFooEvent)).toEqual([eventListener]);
  });

  it('supports `once` listeners', () => {
    // Add a listener with once set to true
    addEventListener(TestFooEvent, 'test-listener', callback, true);

    // Should register the listener with once set to true
    expect(getEventListeners(TestFooEvent)).toEqual([
      { ...eventListener, once: true },
    ]);
  });
});
