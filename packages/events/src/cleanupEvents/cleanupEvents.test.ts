import { describe, expect, it, vi } from 'vitest';
import { getEventListeners } from '../EventListenersStore';
import { getEventLogEntries } from '../EventLogsStore';
import { addEventListener } from '../addEventListener';
import { dispatchEvent } from '../dispatchEvent';
import { TestFooEvent } from '../test-utils';
import { cleanupEvents } from './cleanupEvents';

describe('cleanupEvents', () => {
  it('clears the listeners and the event log synchronously when nothing is pending', () => {
    addEventListener(TestFooEvent, 'test-listener', vi.fn());

    cleanupEvents();

    expect(getEventListeners(TestFooEvent)).toEqual([]);
    expect(getEventLogEntries()).toEqual([]);
  });

  it('clears once pending dispatches have settled', async () => {
    let settled = false;

    // A listener whose side effect spans an await hop
    addEventListener(TestFooEvent, 'test-listener', async () => {
      await Promise.resolve();

      settled = true;
    });

    dispatchEvent(TestFooEvent);

    await cleanupEvents();

    // The listener ran to completion before the clear
    expect(settled).toBe(true);
    expect(getEventListeners(TestFooEvent)).toEqual([]);
    expect(getEventLogEntries()).toEqual([]);
  });
});
