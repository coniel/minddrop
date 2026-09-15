import { describe, expect, it } from 'vitest';
import { removeEntryFromColumns } from './removeEntryFromColumns';

describe('removeEntryFromColumns', () => {
  it('removes the entry from its column', () => {
    const columns = [['entry-1', 'entry-2'], ['entry-3']];

    expect(removeEntryFromColumns(columns, 'entry-2')).toEqual([
      ['entry-1'],
      ['entry-3'],
    ]);
  });

  it('leaves the columns unchanged when the entry is not on the board', () => {
    const columns = [['entry-1'], ['entry-2']];

    expect(removeEntryFromColumns(columns, 'entry-3')).toEqual(columns);
  });

  it('does not modify the original columns', () => {
    const columns = [['entry-1', 'entry-2']];

    removeEntryFromColumns(columns, 'entry-1');

    expect(columns).toEqual([['entry-1', 'entry-2']]);
  });
});
