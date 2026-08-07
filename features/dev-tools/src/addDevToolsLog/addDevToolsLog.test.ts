import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DevToolsLogsStore } from '../DevToolsLogsStore';
import { MaxLogEntries } from '../constants';
import { cleanup, setup } from '../test-utils';
import { addDevToolsLog } from './addDevToolsLog';

describe('addDevToolsLog', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('adds the entry to the logs', () => {
    addDevToolsLog('warn', ['Slow query'], { file: 'sql.ts', line: 8 });

    const [entry] = DevToolsLogsStore.getAll();

    expect(entry.level).toBe('warn');
    expect(entry.args).toEqual(['Slow query']);
    expect(entry.source).toEqual({ file: 'sql.ts', line: 8 });
  });

  it('records no source when none is given', () => {
    addDevToolsLog('log', ['App started']);

    expect(DevToolsLogsStore.getAll()[0].source).toBeNull();
  });

  it('keeps entries in the order they were logged', () => {
    addDevToolsLog('log', ['first']);
    addDevToolsLog('log', ['second']);

    expect(DevToolsLogsStore.getAll().map((entry) => entry.args)).toEqual([
      ['first'],
      ['second'],
    ]);
  });

  it('drops the oldest entries past the maximum', () => {
    for (let index = 0; index < MaxLogEntries + 2; index += 1) {
      addDevToolsLog('log', [`message ${index}`]);
    }

    const entries = DevToolsLogsStore.getAll();

    expect(entries.length).toBe(MaxLogEntries);
    expect(entries[0].args).toEqual(['message 2']);
  });
});
