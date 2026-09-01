import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { cleanup, setup } from '../test-utils';
import { dispatchDynamicEvent } from './dispatchDynamicEvent';

// A test event stood in for the event names the user types
const TestDynamicEvent = 'test:dynamic';

// Register the test event so a listener can be added for it
declare module '@minddrop/events/EventDataMap' {
  interface EventDataMap {
    'test:dynamic': { value: string };
  }
}

describe('dispatchDynamicEvent', () => {
  beforeEach(setup);

  afterEach(() => {
    Events._clearAll();
    cleanup();
  });

  it('dispatches the event under the given name', async () => {
    let received: unknown;

    Events.addListener(TestDynamicEvent, 'test', ({ data }) => {
      received = data;
    });

    await dispatchDynamicEvent(TestDynamicEvent, { value: 'test' });

    expect(received).toEqual({ value: 'test' });
  });
});
