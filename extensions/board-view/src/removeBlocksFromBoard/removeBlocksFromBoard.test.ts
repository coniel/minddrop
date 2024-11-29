import { describe, it, expect, afterEach, vi } from 'vitest';
import { removeBlocksFromBoard } from './removeBlocksFromBoard';
import { BoardView } from '../types';
import { Block } from '@minddrop/extension';

const block1 = {
  id: 'block-1',
} as Block;

const block2 = {
  id: 'block-2',
} as Block;

const block3 = {
  id: 'block-3',
} as Block;

const board: BoardView = {
  id: 'board',
  blocks: [block1.id, block2.id, block3.id],
  type: 'board',
  sections: [
    {
      type: 'columns',
      id: 'section-1',
      columns: [{ id: 'column-1', blocks: [block1.id] }],
    },
    {
      type: 'list',
      id: 'section-2',
      blocks: [block2.id],
    },
    {
      type: 'grid',
      id: 'section-3',
      blocks: [block3.id],
    },
  ],
};

describe('removeBlocksFromBoard', () => {
  const updateView = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('removes blocks from the view', () => {
    removeBlocksFromBoard(board, [block1, block2], updateView);

    // Should remove the blocks from the view's list of blocks
    expect(updateView.mock.calls[0][0].blocks).toEqual([block3.id]);
  });

  it('removes blocks from columns sections', () => {
    removeBlocksFromBoard(board, [block1], updateView);

    // Should remove the block from the columns section
    expect(updateView.mock.calls[0][0].sections[0].columns[0].blocks).toEqual(
      [],
    );
  });

  it('removes blocks from list sections', () => {
    removeBlocksFromBoard(board, [block2], updateView);

    // Should remove the block from the list section
    expect(updateView.mock.calls[0][0].sections[1].blocks).toEqual([]);
  });

  it('removes blocks from grid sections', () => {
    removeBlocksFromBoard(board, [block3], updateView);

    // Should remove the block from the grid section
    expect(updateView.mock.calls[0][0].sections[2].blocks).toEqual([]);
  });
});
