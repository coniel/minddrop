import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  clearEventListeners,
  getEventListeners,
  setEventListeners,
} from '../EventListenersStore';
import { TestBarEvent, TestFooEvent } from '../test-utils';
import { addEventListeners } from './addEventListeners';

const fooCallback = vi.fn();
const barCallback = vi.fn();

describe('addEventListeners', () => {
  afterEach(() => {
    clearEventListeners();
  });

  it('adds a listener for each event under the same ID', () => {
    // Add listeners for two events at once
    addEventListeners('test-listener', {
      [TestFooEvent]: fooCallback,
      [TestBarEvent]: barCallback,
    });

    // Should register both events with the listener
    expect(getEventListeners(TestFooEvent)).toEqual([
      { id: 'test-listener', callback: fooCallback, once: false },
    ]);
    expect(getEventListeners(TestBarEvent)).toEqual([
      { id: 'test-listener', callback: barCallback, once: false },
    ]);
  });

  it('skips events without a callback', () => {
    // Add listeners with one event left undefined
    addEventListeners('test-listener', {
      [TestFooEvent]: fooCallback,
      [TestBarEvent]: undefined,
    });

    // Should only register the event with a callback
    expect(getEventListeners(TestFooEvent)).toHaveLength(1);
    expect(getEventListeners(TestBarEvent)).toEqual([]);
  });

  it('does not add duplicate event listeners', () => {
    // Add an existing 'test-listener' listener for the first event
    const existingListener = {
      id: 'test-listener',
      callback: vi.fn(),
      once: false,
    };
    setEventListeners(TestFooEvent, [existingListener]);

    // Attempt to add 'test-listener' again for both events
    addEventListeners('test-listener', {
      [TestFooEvent]: fooCallback,
      [TestBarEvent]: barCallback,
    });

    // Should keep the existing listener and add only the new event
    expect(getEventListeners(TestFooEvent)).toEqual([existingListener]);
    expect(getEventListeners(TestBarEvent)).toEqual([
      { id: 'test-listener', callback: barCallback, once: false },
    ]);
  });
});
