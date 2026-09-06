import { afterEach, describe, expect, it, vi } from 'vitest';
import { TestBarEvent, TestFooEvent } from '../test-utils';
import {
  clearEventListeners,
  getEventListeners,
  setEventListeners,
} from './EventListenersStore';

const listener = { id: 'test-listener', callback: vi.fn() };

describe('EventListenersStore', () => {
  afterEach(() => {
    clearEventListeners();
  });

  it('returns no listeners for an event without any', () => {
    expect(getEventListeners(TestFooEvent)).toEqual([]);
  });

  it('sets the listeners of an event', () => {
    setEventListeners(TestFooEvent, [listener]);

    expect(getEventListeners(TestFooEvent)).toEqual([listener]);
  });

  it('keeps the listeners of other events', () => {
    setEventListeners(TestFooEvent, [listener]);
    setEventListeners(TestBarEvent, [listener]);

    // Replacing one event's listeners leaves the other's alone
    setEventListeners(TestFooEvent, []);

    expect(getEventListeners(TestBarEvent)).toEqual([listener]);
  });

  it('clears every listener', () => {
    setEventListeners(TestFooEvent, [listener]);
    setEventListeners(TestBarEvent, [listener]);

    clearEventListeners();

    expect(getEventListeners(TestFooEvent)).toEqual([]);
    expect(getEventListeners(TestBarEvent)).toEqual([]);
  });
});
