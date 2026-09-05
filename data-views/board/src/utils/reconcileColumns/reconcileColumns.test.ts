import { describe, expect, it } from 'vitest';
import { reconcileColumns } from './reconcileColumns';

describe('reconcileColumns', () => {
  it('appends unplaced entries to the first column', () => {
    const columns = reconcileColumns(
      [['entry-1'], ['entry-2']],
      ['entry-1', 'entry-2', 'entry-3'],
    );

    expect(columns).toEqual([['entry-1', 'entry-3'], ['entry-2']]);
  });

  it('removes entries no longer in the collection', () => {
    const columns = reconcileColumns([['entry-1', 'entry-2']], ['entry-2']);

    expect(columns).toEqual([['entry-2']]);
  });

  it('places unplaced duplicates below their original', () => {
    const columns = reconcileColumns(
      [['entry-1'], ['entry-2', 'entry-3']],
      ['entry-1', 'entry-2', 'entry-3', 'duplicate-1'],
      { 'duplicate-1': 'entry-2' },
    );

    expect(columns).toEqual([
      ['entry-1'],
      ['entry-2', 'duplicate-1', 'entry-3'],
    ]);
  });

  it('appends duplicates whose original is not on the board', () => {
    const columns = reconcileColumns(
      [['entry-1']],
      ['entry-1', 'duplicate-1'],
      { 'duplicate-1': 'entry-gone' },
    );

    expect(columns).toEqual([['entry-1', 'duplicate-1']]);
  });
});
