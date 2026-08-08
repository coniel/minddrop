import { describe, expect, it } from 'vitest';
import { placeEntryInColumn } from './placeEntryInColumn';

describe('placeEntryInColumn', () => {
  it('inserts the entry at the given position', () => {
    const columns = [['entry-1', 'entry-2'], []];

    expect(placeEntryInColumn(columns, 'entry-3', 0, 1)).toEqual([
      ['entry-1', 'entry-3', 'entry-2'],
      [],
    ]);
  });

  it('moves the entry out of its current column', () => {
    const columns = [['entry-1', 'entry-2'], []];

    expect(placeEntryInColumn(columns, 'entry-1', 1, 0)).toEqual([
      ['entry-2'],
      ['entry-1'],
    ]);
  });

  it('returns the columns unchanged when the target column does not exist', () => {
    const columns = [['entry-1']];

    expect(placeEntryInColumn(columns, 'entry-1', 2, 0)).toEqual(columns);
  });

  it('does not modify the original columns', () => {
    const columns = [['entry-1']];

    placeEntryInColumn(columns, 'entry-2', 0, 0);

    expect(columns).toEqual([['entry-1']]);
  });
});
