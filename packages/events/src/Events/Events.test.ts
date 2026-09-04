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

  it('types batch listener data from the event data registry', async () => {
    let received: TestRegisteredEventData | undefined;
    let voidCalled = false;

    // Each callback's data derives from its key in the map
    Events.addListeners('test', {
      [TestRegisteredEvent]: ({ data }) => {
        received = data;
      },
      [TestVoidEvent]: () => {
        voidCalled = true;
      },
    });

    await Events.dispatch(TestRegisteredEvent, { value: 1 });
    await Events.dispatch(TestVoidEvent);

    expect(received).toEqual({ value: 1 });
    expect(voidCalled).toBe(true);
  });

  it('rejects mismatched event data at compile time', () => {
    // @ts-expect-error wrong data shape for the event
    Events.dispatch(TestRegisteredEvent, { value: 'one' });

    // @ts-expect-error data supplied to an event registered as void
    Events.dispatch(TestVoidEvent, { value: 1 });

    expect(Events.hasListener(TestVoidEvent, 'none')).toBe(false);
  });

  it('rejects unregistered event names at compile time', () => {
    // @ts-expect-error the event is not in the registry
    Events.dispatch('test:unregistered');

    // @ts-expect-error the event is not in the registry
    Events.addListener('test:unregistered', 'test', () => {});

    // @ts-expect-error the event is not in the registry
    Events.removeListener('test:unregistered', 'test');

    // @ts-expect-error the event is not in the registry
    Events.addListeners('test', { 'test:unregistered': () => {} });

    expect(Events.hasListener(TestVoidEvent, 'none')).toBe(false);
  });
});
