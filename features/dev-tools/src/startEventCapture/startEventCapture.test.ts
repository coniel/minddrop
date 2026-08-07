import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { DevToolsEventsStore } from '../DevToolsEventsStore';
import { cleanup, setup } from '../test-utils';
import { startEventCapture } from './startEventCapture';

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
    await Events.dispatch('databases:create', { id: 'db_1' });

    const [entry] = DevToolsEventsStore.getAll();

    expect(entry.name).toBe('databases:create');
    expect(entry.data).toEqual({ id: 'db_1' });
  });

  it('does not capture the catch all listener itself', async () => {
    await Events.dispatch('*');

    expect(DevToolsEventsStore.getAll()).toEqual([]);
  });

  it('stops capturing once stopped', async () => {
    stopCapture();

    await Events.dispatch('databases:create');

    expect(DevToolsEventsStore.getAll()).toEqual([]);
  });
});
