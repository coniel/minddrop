import { describe, expect, it } from 'vitest';
import { KanbanColumn } from '../../types';
import { placeEntryInColumn } from './placeEntryInColumn';

// Builds columns from their entry IDs, keyed by column value
function columns(entryIds: Record<string, string[]>): KanbanColumn[] {
  return Object.entries(entryIds).map(([value, ids]) => ({
    value,
    label: value,
    entryIds: ids,
  }));
}

describe('placeEntryInColumn', () => {
  it('inserts the entry at the given position', () => {
    const board = columns({ '': ['entry-1', 'entry-2'], Todo: [] });

    expect(placeEntryInColumn(board, 'entry-3', '', 1)).toEqual({
      '': ['entry-1', 'entry-3', 'entry-2'],
      Todo: [],
    });
  });

  it('moves the entry out of its current column', () => {
    const board = columns({ '': ['entry-1', 'entry-2'], Todo: [] });

    expect(placeEntryInColumn(board, 'entry-1', 'Todo', 0)).toEqual({
      '': ['entry-2'],
      Todo: ['entry-1'],
    });
  });

  it('places the entry in a column the board does not hold', () => {
    const board = columns({ '': ['entry-1'] });

    expect(placeEntryInColumn(board, 'entry-1', 'Done', 0)).toEqual({
      '': [],
      Done: ['entry-1'],
    });
  });

  it('accounts for the removed entry when moving down within its column', () => {
    const board = columns({ Todo: ['entry-1', 'entry-2', 'entry-3'] });

    // Dropping entry-1 into the gap below entry-2 (gap index 2)
    // places it directly after entry-2.
    expect(placeEntryInColumn(board, 'entry-1', 'Todo', 2)).toEqual({
      Todo: ['entry-2', 'entry-1', 'entry-3'],
    });
  });

  it('keeps the position when moving up within its column', () => {
    const board = columns({ Todo: ['entry-1', 'entry-2', 'entry-3'] });

    // Dropping entry-3 into the gap above entry-2 (gap index 1)
    // places it directly before entry-2.
    expect(placeEntryInColumn(board, 'entry-3', 'Todo', 1)).toEqual({
      Todo: ['entry-1', 'entry-3', 'entry-2'],
    });
  });

  it('clamps positions beyond the end of the column', () => {
    const board = columns({ Todo: ['entry-1'] });

    expect(placeEntryInColumn(board, 'entry-2', 'Todo', 8)).toEqual({
      Todo: ['entry-1', 'entry-2'],
    });
  });

  it('saves the placement of every rendered entry', () => {
    const board = columns({
      Todo: ['entry-1', 'entry-2'],
      Done: ['entry-3'],
    });

    expect(placeEntryInColumn(board, 'entry-2', 'Todo', 0)).toEqual({
      Todo: ['entry-2', 'entry-1'],
      Done: ['entry-3'],
    });
  });
});
