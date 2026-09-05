import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Events } from '@minddrop/events';
import { DevToolsEventsStore } from '../DevToolsEventsStore';
import { DevToolsNamespace } from '../constants';
import { cleanup, setup } from '../test-utils';
import { startEventCapture } from './startEventCapture';

// A test event stood in for the events the app dispatches
const TestCapturedEvent = 'test:captured';

// Register the test event so it can be dispatched
declare module '@minddrop/events/EventDataMap' {
  interface EventDataMap {
    'test:captured': { id: string } | undefined;
  }
}

describe('startEventCapture', () => {
  let stopCapture: VoidFunction;

  beforeEach(() => {
    setup();

    stopCapture = startEventCapture();
  });

  afterEach(() => {
    stopCapture();
    cleanup();
  });

  it('captures dispatched events', async () => {
    Events.dispatch(TestCapturedEvent, { id: 'db_1' });

    // The capture listener runs queued rather than during the
    // dispatch.
    await vi.waitFor(() => {
      const [entry] = DevToolsEventsStore.getAll();

      expect(entry.name).toBe(TestCapturedEvent);
      expect(entry.data).toEqual({ id: 'db_1' });
    });
  });

  it('does not capture the events the dev tools dispatch themselves', async () => {
    Events.dispatch('stores:persist', {
      namespace: DevToolsNamespace,
      persistTo: 'app-config',
      data: {},
    });

    expect(DevToolsEventsStore.getAll()).toEqual([]);
  });

  it('captures the events of other stores', async () => {
    Events.dispatch('stores:persist', {
      namespace: 'app-ui',
      persistTo: 'app-config',
      data: {},
    });

    // The capture listener runs queued rather than during the
    // dispatch.
    await vi.waitFor(() => {
      expect(DevToolsEventsStore.getAll().length).toBe(1);
    });
  });

  it('does not capture the catch all listener itself', async () => {
    Events.dispatch('*');

    expect(DevToolsEventsStore.getAll()).toEqual([]);
  });

  it('stops capturing once stopped', async () => {
    stopCapture();

    Events.dispatch(TestCapturedEvent);

    expect(DevToolsEventsStore.getAll()).toEqual([]);
  });
});
