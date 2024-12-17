import { describe, expect, it } from 'vitest';
import { Block } from '@minddrop/extension';
import {
  BoardColumnsSection,
  BoardGridSection,
  BoardListSection,
  BoardView,
} from '../../types';
import { removeBlocksFromBoard } from './removeBlocksFromBoard';

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
  it('removes blocks from the view', () => {
    const updated = removeBlocksFromBoard(board, [block1.id, block2.id]);

    // Should remove the blocks from the view's list of blocks
    expect(updated.blocks).toEqual([block3.id]);
  });

  it('removes blocks from columns sections', () => {
    const updated = removeBlocksFromBoard(board, [block1.id]);

    // Should remove the block from the columns section
    expect(
      (updated.sections[0] as BoardColumnsSection).columns[0].blocks,
    ).toEqual([]);
  });

  it('removes blocks from list sections', () => {
    const updated = removeBlocksFromBoard(board, [block2.id]);

    // Should remove the block from the list section
    expect((updated.sections[1] as BoardListSection).blocks).toEqual([]);
  });

  it('removes blocks from grid sections', () => {
    const updated = removeBlocksFromBoard(board, [block3.id]);

    // Should remove the block from the grid section
    expect((updated.sections[2] as BoardGridSection).blocks).toEqual([]);
  });
});
