import { afterEach, describe, expect, it } from 'vitest';
import { Events } from './Events';

// A test event registered in the event data registry below
const TestRegisteredEvent = 'test:registered';
// A test event carrying no data
const TestVoidEvent = 'test:void';

interface TestRegisteredEventData {
  value: number;
}

// Register the test events so the API methods derive their data types
declare module '../types/EventDataMap.types' {
  interface EventDataMap {
    'test:registered': TestRegisteredEventData;
    'test:void': void;
  }
}

describe('Events', () => {
  afterEach(() => {
    Events._clearAll();
  });

  it('types listener data from the event data registry', async () => {
    let received: TestRegisteredEventData | undefined;

    // The callback data derives from the registered event name
    Events.addListener(TestRegisteredEvent, 'test', ({ data }) => {
      received = data;
    });

    await Events.dispatch(TestRegisteredEvent, { value: 1 });

    expect(received).toEqual({ value: 1 });
  });

  it('rejects mismatched event data at compile time', () => {
    // @ts-expect-error wrong data shape for the event
    Events.dispatch(TestRegisteredEvent, { value: 'one' });

    // @ts-expect-error data supplied to an event registered as void
    Events.dispatch(TestVoidEvent, { value: 1 });

    expect(Events.hasListener(TestVoidEvent, 'none')).toBe(false);
  });

  it('leaves unregistered event data unknown', async () => {
    let received: unknown;

    // Unregistered events remain dispatchable with any data
    Events.addListener('test:unregistered', 'test', ({ data }) => {
      received = data;
    });

    await Events.dispatch('test:unregistered', 'anything');

    expect(received).toBe('anything');
  });
});
