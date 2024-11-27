import { describe, it, expect } from 'vitest';
import { Block } from '@minddrop/extension';
import {
  boardContent,
  column1Block,
  textBlock1,
  textBlock3,
} from '../test-utils';
import { removeBlocksFromBoard } from './removeBlocksFromBoard';

describe('removeBlocksFromBoard', () => {
  it('removes the blocks from the board content', () => {
    const result = removeBlocksFromBoard(boardContent, [
      textBlock1,
      textBlock3,
    ]);

    // Should remove the blocks from the board
    expect(result.blocks).not.toContain(textBlock1);
    expect(result.blocks).not.toContain(textBlock3);
  });

  it('updates layout blocks to remove the blocks from their children', () => {
    const result = removeBlocksFromBoard(boardContent, [textBlock1]);

    // Get the updated group block
    const groupBlock = result.blocks.find(
      (block) => block.id === column1Block.id,
    ) as Block;
    // Should remove the block from the group block children
    expect(groupBlock.children).not.toContain(textBlock1.id);
  });

  it('does nothing if the blocks do not appear on the board', () => {
    const result = removeBlocksFromBoard(boardContent, [
      { ...textBlock1, id: 'unknown-id' },
    ]);

    // Should not change the board content
    expect(result).toEqual(boardContent);
  });
});
