import { describe, it, expect } from 'vitest';
import { Utils } from '@minddrop/extension';
import { addBlocksToBoard } from './addBlocksToBoard';
import { boardDocument } from '../test-utils';

const newBlocks = [
  Utils.generateBlock('board-column'),
  Utils.generateBlock('board-column'),
];

describe('addBlockToBoard', () => {
  it('adds the blocks to the board content', () => {
    const updatedContent = addBlocksToBoard(boardDocument.content, newBlocks);

    expect(updatedContent).toEqual({
      ...boardDocument.content,
      blocks: [...boardDocument.content.blocks, ...newBlocks],
    });
  });
});
