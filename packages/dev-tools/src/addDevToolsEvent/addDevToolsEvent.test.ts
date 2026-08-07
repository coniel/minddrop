import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DevToolsEventsStore } from '../DevToolsEventsStore';
import { MaxEventEntries } from '../constants';
import { cleanup, setup } from '../test-utils';
import { addDevToolsEvent } from './addDevToolsEvent';

describe('addDevToolsEvent', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('adds the event to the captured events', () => {
    addDevToolsEvent('databases:create', { id: 'db_1' });

    const [entry] = DevToolsEventsStore.getAll();

    expect(entry.name).toBe('databases:create');
    expect(entry.data).toEqual({ id: 'db_1' });
  });

  it('keeps events in the order they were dispatched', () => {
    addDevToolsEvent('databases:create', undefined);
    addDevToolsEvent('views:open', undefined);

    expect(DevToolsEventsStore.getAll().map((entry) => entry.name)).toEqual([
      'databases:create',
      'views:open',
    ]);
  });

  it('drops the oldest events past the maximum', () => {
    for (let index = 0; index < MaxEventEntries + 2; index += 1) {
      addDevToolsEvent(`test:event-${index}`, undefined);
    }

    const entries = DevToolsEventsStore.getAll();

    expect(entries.length).toBe(MaxEventEntries);
    expect(entries[0].name).toBe('test:event-2');
  });
});
