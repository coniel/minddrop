import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { DevToolsEventsStore } from '../DevToolsEventsStore';
import { DevToolsNamespace } from '../constants';
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

  it('does not capture the events the dev tools dispatch themselves', async () => {
    await Events.dispatch('stores:persist', {
      namespace: DevToolsNamespace,
      persistTo: 'app-config',
      data: {},
    });

    expect(DevToolsEventsStore.getAll()).toEqual([]);
  });

  it('captures the events of other stores', async () => {
    await Events.dispatch('stores:persist', {
      namespace: 'app-ui',
      persistTo: 'app-config',
      data: {},
    });

    expect(DevToolsEventsStore.getAll().length).toBe(1);
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
