import { describe, expect, it } from 'vitest';
import { Block } from '@minddrop/extension';
import {
  BoardColumnsSection,
  BoardListSection,
  BoardSection,
} from '../../types';
import { moveBlocksWithinBoard } from './moveBlocksWithinBoard';

const block1 = {
  id: 'block-1',
} as Block;

const block2 = {
  id: 'block-2',
} as Block;

const block3 = {
  id: 'block-3',
} as Block;

const block4 = {
  id: 'block-4',
} as Block;

const block5 = {
  id: 'block-5',
} as Block;

const block6 = {
  id: 'block-6',
} as Block;

const block7 = {
  id: 'block-7',
} as Block;

const block8 = {
  id: 'block-8',
} as Block;

const block9 = {
  id: 'block-9',
} as Block;

const sections: BoardSection[] = [
  {
    type: 'columns',
    id: 'section-1',
    columns: [{ id: 'column-1', blocks: [block1.id, block2.id, block3.id] }],
  },
  {
    type: 'list',
    id: 'section-2',
    blocks: [block4.id, block5.id, block6.id],
  },
  {
    type: 'grid',
    id: 'section-3',
    blocks: [block7.id, block8.id, block9.id],
  },
];

describe('moveBlocksWithinBoard', () => {
  it('moves blocks into columns sections', () => {
    const updatedSections = moveBlocksWithinBoard(
      sections,
      0,
      [block1.id, block5.id, block7.id],
      2,
      0,
    );

    // Adds blocks to the correct column at the correct position
    expect(
      (updatedSections[0] as BoardColumnsSection).columns[0].blocks,
    ).toEqual([block2.id, block1.id, block5.id, block7.id, block3.id]);
    // Removes the blocks from the other sections
    expect((updatedSections[1] as BoardListSection).blocks).toEqual([
      block4.id,
      block6.id,
    ]);
    expect((updatedSections[2] as BoardListSection).blocks).toEqual([
      block8.id,
      block9.id,
    ]);
  });

  it('moves blocks into list sections', () => {
    const updatedSections = moveBlocksWithinBoard(
      sections,
      1,
      [block4.id, block1.id, block7.id],
      2,
    );

    // Adds blocks to the correct position
    expect((updatedSections[1] as BoardListSection).blocks).toEqual([
      block5.id,
      block4.id,
      block1.id,
      block7.id,
      block6.id,
    ]);
    // Removes the blocks from the other sections
    expect(
      (updatedSections[0] as BoardColumnsSection).columns[0].blocks,
    ).toEqual([block2.id, block3.id]);
    expect((updatedSections[2] as BoardListSection).blocks).toEqual([
      block8.id,
      block9.id,
    ]);
  });

  it('moves blocks into grid sections', () => {
    const updatedSections = moveBlocksWithinBoard(
      sections,
      2,
      [block7.id, block1.id, block4.id],
      2,
    );

    // Adds blocks to the correct position
    expect((updatedSections[2] as BoardListSection).blocks).toEqual([
      block8.id,
      block7.id,
      block1.id,
      block4.id,
      block9.id,
    ]);
    // Removes the blocks from the other sections
    expect(
      (updatedSections[0] as BoardColumnsSection).columns[0].blocks,
    ).toEqual([block2.id, block3.id]);
    expect((updatedSections[1] as BoardListSection).blocks).toEqual([
      block5.id,
      block6.id,
    ]);
  });
});
