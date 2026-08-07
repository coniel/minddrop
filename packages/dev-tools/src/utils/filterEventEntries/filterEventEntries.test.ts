import { describe, expect, it } from 'vitest';
import { DevToolsFixtures } from '../../test-utils';
import { filterEventEntries } from './filterEventEntries';

const { createEntryEvent, updateEntryEvent, openViewEvent } = DevToolsFixtures;

const entries = [createEntryEvent, updateEntryEvent, openViewEvent];

describe('filterEventEntries', () => {
  it('returns every event without filters', () => {
    expect(filterEventEntries(entries)).toEqual(entries);
  });

  it('filters by event name path', () => {
    expect(filterEventEntries(entries, { path: 'databases:entries' })).toEqual([
      createEntryEvent,
      updateEntryEvent,
    ]);
  });

  it('filters by search text, ignoring case', () => {
    expect(filterEventEntries(entries, { search: 'VIEWS' })).toEqual([
      openViewEvent,
    ]);
  });

  it('searches within event data', () => {
    expect(filterEventEntries(entries, { search: 'entry_2' })).toEqual([
      updateEntryEvent,
    ]);
  });

  it('applies both filters at once', () => {
    expect(
      filterEventEntries(entries, {
        path: 'databases',
        search: 'entry_1',
      }),
    ).toEqual([createEntryEvent]);
  });
});
