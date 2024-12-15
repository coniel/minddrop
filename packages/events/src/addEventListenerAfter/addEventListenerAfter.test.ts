import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EventListener, EventListenerMap } from '../types';
import { addEventListenerAfter } from './addEventListenerAfter';

describe('addEventListenerAfter', () => {
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

  it('does not add the listener if the event is not registered', () => {
    // Add a listener for an event which is not registered
    addEventListenerAfter(
      eventsListeners,
      'test-event',
      'target-id',
      'test-listener',
      callback,
    );

    // Should not add a listener
    expect(eventsListeners).toEqual({});
  });

  it('does not add the listener if `afterListenerId` is not registered', () => {
    // Add an existing listeners for 'test-event'
    const existingListener = { ...eventListener, id: 'one' };
    eventsListeners['test-event'] = {
      listeners: [existingListener],
    };

    // Add a listener after listener 'two' which is not registered
    addEventListenerAfter(
      eventsListeners,
      'test-event',
      'two',
      'test-listener',
      callback,
    );

    // Should not add the listener
    expect(eventsListeners).toEqual({
      'test-event': { listeners: [existingListener] },
    });
  });

  it('adds listener after the specified one', () => {
    // Add a couple of existing listeners for 'test-event'
    const existingListener1 = { ...eventListener, id: 'one' };
    const existingListener2 = { ...eventListener, id: 'two' };
    eventsListeners['test-event'] = {
      listeners: [existingListener1, existingListener2],
    };

    // Add a new listener after listener 'one'
    addEventListenerAfter(
      eventsListeners,
      'test-event',
      'one',
      'test-listener',
      callback,
    );

    // Should add new listener after listener 'one'
    expect(eventsListeners).toEqual({
      'test-event': {
        listeners: [existingListener1, eventListener, existingListener2],
      },
    });
  });

  it('sets `once` value', () => {
    // Add a couple of existing listeners for 'test-event'
    const existingListener1 = { ...eventListener, id: 'one' };
    const existingListener2 = { ...eventListener, id: 'two' };
    eventsListeners['test-event'] = {
      listeners: [existingListener1, existingListener2],
    };

    // Add a one time listener for 'test-event' after
    // listener 'one'.
    addEventListenerAfter(
      eventsListeners,
      'test-event',
      'one',
      'test-listener',
      callback,
      true,
    );

    // Should set 'once' to true
    expect(eventsListeners).toEqual({
      'test-event': {
        listeners: [
          existingListener1,
          { ...eventListener, once: true },
          existingListener2,
        ],
      },
    });
  });

  it('does not add a duplicate event listener', () => {
    // Add a couple of existing listeners for 'test-event'
    const existingListener1 = { ...eventListener, id: 'one' };
    const existingListener2 = { ...eventListener, id: 'two' };
    eventsListeners['test-event'] = {
      listeners: [existingListener1, existingListener2],
    };

    // Attempt to add a second listener 'two'
    addEventListenerAfter(
      eventsListeners,
      'test-event',
      'one',
      'two',
      callback,
    );

    // Should not add the second listener
    expect(eventsListeners).toEqual({
      'test-event': {
        listeners: [existingListener1, existingListener2],
      },
    });
  });
});
