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

  it('accounts for the removed entry when moving down within its column', () => {
    const columns = [['entry-1', 'entry-2', 'entry-3']];

    // Dropping entry-1 into the gap below entry-2 (gap index 2)
    // places it directly after entry-2
    expect(placeEntryInColumn(columns, 'entry-1', 0, 2)).toEqual([
      ['entry-2', 'entry-1', 'entry-3'],
    ]);
  });

  it('keeps the position when moving up within its column', () => {
    const columns = [['entry-1', 'entry-2', 'entry-3']];

    // Dropping entry-3 into the gap above entry-2 (gap index 1)
    // places it directly before entry-2
    expect(placeEntryInColumn(columns, 'entry-3', 0, 1)).toEqual([
      ['entry-1', 'entry-3', 'entry-2'],
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
