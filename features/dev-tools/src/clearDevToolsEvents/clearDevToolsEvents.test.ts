import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DevToolsEventsStore } from '../DevToolsEventsStore';
import { DevToolsFixtures, cleanup, setup } from '../test-utils';
import { clearDevToolsEvents } from './clearDevToolsEvents';

const { createEntryEvent, openViewEvent } = DevToolsFixtures;

describe('clearDevToolsEvents', () => {
  beforeEach(() => {
    setup();

    DevToolsEventsStore.load([createEntryEvent, openViewEvent]);
  });

  afterEach(cleanup);

  it('removes all captured events', () => {
    clearDevToolsEvents();

    expect(DevToolsEventsStore.getAll()).toEqual([]);
  });
});
