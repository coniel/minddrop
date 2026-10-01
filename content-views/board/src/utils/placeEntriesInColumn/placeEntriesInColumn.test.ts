import { describe, expect, it } from 'vitest';
import { placeEntriesInColumn } from './placeEntriesInColumn';

describe('placeEntriesInColumn', () => {
  it('inserts the entries in order from the given position', () => {
    const columns = [['entry-1', 'entry-2'], []];

    expect(placeEntriesInColumn(columns, ['entry-3', 'entry-4'], 0, 1)).toEqual(
      [['entry-1', 'entry-3', 'entry-4', 'entry-2'], []],
    );
  });

  it('moves entries out of their current columns', () => {
    const columns = [['entry-1'], ['entry-2']];

    expect(placeEntriesInColumn(columns, ['entry-1', 'entry-2'], 1, 0)).toEqual(
      [[], ['entry-1', 'entry-2']],
    );
  });

  it('leaves the columns as they are with no entries', () => {
    const columns = [['entry-1'], []];

    expect(placeEntriesInColumn(columns, [], 1, 0)).toBe(columns);
  });
});
