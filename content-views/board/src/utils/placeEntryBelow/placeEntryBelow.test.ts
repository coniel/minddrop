import { describe, expect, it } from 'vitest';
import { placeEntryBelow } from './placeEntryBelow';

describe('placeEntryBelow', () => {
  it('inserts the entry directly below the target entry', () => {
    const columns = [['entry-1', 'entry-2'], []];

    expect(placeEntryBelow(columns, 'entry-1', 'entry-3')).toEqual([
      ['entry-1', 'entry-3', 'entry-2'],
      [],
    ]);
  });

  it('places below a target at the end of its column', () => {
    const columns = [['entry-1'], ['entry-2']];

    expect(placeEntryBelow(columns, 'entry-2', 'entry-3')).toEqual([
      ['entry-1'],
      ['entry-2', 'entry-3'],
    ]);
  });

  it('returns the columns unchanged when the target entry is not on the board', () => {
    const columns = [['entry-1']];

    expect(placeEntryBelow(columns, 'missing', 'entry-2')).toBe(columns);
  });

  it('does not modify the original columns', () => {
    const columns = [['entry-1']];

    placeEntryBelow(columns, 'entry-1', 'entry-2');

    expect(columns).toEqual([['entry-1']]);
  });
});
