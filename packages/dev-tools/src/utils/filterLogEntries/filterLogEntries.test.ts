import { describe, expect, it } from 'vitest';
import { DevToolsFixtures } from '../../test-utils';
import { filterLogEntries } from './filterLogEntries';

const { messageLogEntry, labelledLogEntry, warningLogEntry, errorLogEntry } =
  DevToolsFixtures;

const entries = [
  messageLogEntry,
  labelledLogEntry,
  warningLogEntry,
  errorLogEntry,
];

describe('filterLogEntries', () => {
  it('returns every entry without filters', () => {
    expect(filterLogEntries(entries)).toEqual(entries);
  });

  it('filters by level', () => {
    expect(filterLogEntries(entries, { level: 'warn' })).toEqual([
      warningLogEntry,
    ]);
  });

  it('filters by search text, ignoring case', () => {
    expect(filterLogEntries(entries, { search: 'app STARTED' })).toEqual([
      messageLogEntry,
    ]);
    expect(
      filterLogEntries(entries, { search: 'nothing logged this' }),
    ).toEqual([]);
  });

  it('searches within logged objects', () => {
    expect(filterLogEntries(entries, { search: '"count": 2' })).toEqual([
      labelledLogEntry,
    ]);
  });

  it('searches within logged errors', () => {
    expect(filterLogEntries(entries, { search: 'query failed' })).toEqual([
      errorLogEntry,
    ]);
  });

  it('filters by label', () => {
    expect(
      filterLogEntries(entries, {
        quickFilter: { type: 'label', value: 'Databases' },
      }),
    ).toEqual([labelledLogEntry]);
  });

  it('filters by source file', () => {
    expect(
      filterLogEntries(entries, {
        quickFilter: { type: 'file', value: 'initializeDatabases.ts' },
      }),
    ).toEqual([labelledLogEntry, warningLogEntry]);
  });

  it('applies every filter at once', () => {
    expect(
      filterLogEntries(entries, {
        level: 'warn',
        search: 'slow',
        quickFilter: { type: 'file', value: 'initializeDatabases.ts' },
      }),
    ).toEqual([warningLogEntry]);
  });
});
