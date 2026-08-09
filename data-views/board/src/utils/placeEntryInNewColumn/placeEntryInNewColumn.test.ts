import { describe, expect, it } from 'vitest';
import { placeEntryInNewColumn } from './placeEntryInNewColumn';

describe('placeEntryInNewColumn', () => {
  it('inserts a new column containing the entry at the gap', () => {
    const columns = [['entry-1'], ['entry-2']];

    expect(placeEntryInNewColumn(columns, 'entry-3', 1)).toEqual([
      ['entry-1'],
      ['entry-3'],
      ['entry-2'],
    ]);
  });

  it('moves the entry out of its current column', () => {
    const columns = [['entry-1', 'entry-2']];

    expect(placeEntryInNewColumn(columns, 'entry-1', 1)).toEqual([
      ['entry-2'],
      ['entry-1'],
    ]);
  });

  it('does not modify the original columns', () => {
    const columns = [['entry-1']];

    placeEntryInNewColumn(columns, 'entry-2', 0);

    expect(columns).toEqual([['entry-1']]);
  });
});
