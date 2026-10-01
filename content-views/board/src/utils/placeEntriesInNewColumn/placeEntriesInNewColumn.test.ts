import { describe, expect, it } from 'vitest';
import { placeEntriesInNewColumn } from './placeEntriesInNewColumn';

describe('placeEntriesInNewColumn', () => {
  it('inserts a column holding the entries in order at the gap', () => {
    const columns = [['entry-1'], ['entry-2']];

    expect(placeEntriesInNewColumn(columns, ['entry-3', 'entry-4'], 1)).toEqual(
      [['entry-1'], ['entry-3', 'entry-4'], ['entry-2']],
    );
  });

  it('moves entries out of their current columns', () => {
    const columns = [['entry-1', 'entry-2'], []];

    expect(placeEntriesInNewColumn(columns, ['entry-2'], 2)).toEqual([
      ['entry-1'],
      [],
      ['entry-2'],
    ]);
  });

  it('inserts no column with no entries', () => {
    const columns = [['entry-1'], []];

    expect(placeEntriesInNewColumn(columns, [], 1)).toBe(columns);
  });
});
