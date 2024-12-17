import { describe, expect, it } from 'vitest';
import { Block } from '@minddrop/extension';
import {
  BoardColumnsSection,
  BoardGridSection,
  BoardListSection,
  BoardSection,
} from '../../types';
import { removeBlocksFromBoardSections } from './removeBlocksFromBoardSections';

const block1 = {
  id: 'block-1',
} as Block;

const block2 = {
  id: 'block-2',
} as Block;

const block3 = {
  id: 'block-3',
} as Block;

const sections: BoardSection[] = [
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
];

describe('removeBlocksFromBoard', () => {
  it('removes blocks from columns sections', () => {
    const updatedSections = removeBlocksFromBoardSections(sections, [
      block1.id,
    ]);

    // Should remove the block from the columns section
    expect(
      (updatedSections[0] as BoardColumnsSection).columns[0].blocks,
    ).toEqual([]);
  });

  it('removes blocks from list sections', () => {
    const updatedSections = removeBlocksFromBoardSections(sections, [
      block2.id,
    ]);

    // Should remove the block from the list section
    expect((updatedSections[1] as BoardListSection).blocks).toEqual([]);
  });

  it('removes blocks from grid sections', () => {
    const updatedSections = removeBlocksFromBoardSections(sections, [
      block3.id,
    ]);

    // Should remove the block from the grid section
    expect((updatedSections[2] as BoardGridSection).blocks).toEqual([]);
  });
});
