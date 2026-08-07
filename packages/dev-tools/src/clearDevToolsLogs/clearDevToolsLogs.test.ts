import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DevToolsLogsStore } from '../DevToolsLogsStore';
import { DevToolsFixtures, cleanup, setup } from '../test-utils';
import { clearDevToolsLogs } from './clearDevToolsLogs';

const { messageLogEntry, warningLogEntry } = DevToolsFixtures;

describe('clearDevToolsLogs', () => {
  beforeEach(() => {
    setup();

    DevToolsLogsStore.load([messageLogEntry, warningLogEntry]);
  });

  afterEach(cleanup);

  it('removes all log entries', () => {
    clearDevToolsLogs();

    expect(DevToolsLogsStore.getAll()).toEqual([]);
  });
});
