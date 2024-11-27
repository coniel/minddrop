import { describe, it, expect } from 'vitest';
import { Block } from '@minddrop/extension';
import {
  boardDocument,
  column1Block,
  textBlock1,
  textBlock2,
} from '../test-utils';
import { addChildBlocksToBoard } from './addChildBlocksToBoard';

const childBlocks = [textBlock1, textBlock2];
const parentBlock = column1Block;

describe('addBlockToBoard', () => {
  it('adds the blocks to the board document', () => {
    const updatedContent = addChildBlocksToBoard(
      boardDocument.content,
      parentBlock,
      childBlocks,
    );

    expect(
      updatedContent.blocks.find((block) => block.id === childBlocks[0].id),
    ).toEqual(childBlocks[0]);
    expect(
      updatedContent.blocks.find((block) => block.id === childBlocks[1].id),
    ).toEqual(childBlocks[1]);
  });

  it('adds the child block IDs to the parent block children', () => {
    const updatedContent = addChildBlocksToBoard(
      boardDocument.content,
      parentBlock,
      childBlocks,
    );

    const updatedParentBlock = updatedContent.blocks.find(
      (block) => block.id === parentBlock.id,
    ) as Block;

    expect(updatedParentBlock.children).toEqual([
      ...parentBlock.children!,
      childBlocks[0].id,
      childBlocks[1].id,
    ]);
  });

  it('adds the child block IDs at the specified index', () => {
    const updatedContent = addChildBlocksToBoard(
      boardDocument.content,
      parentBlock,
      childBlocks,
      1,
    );

    const updatedParentBlock = updatedContent.blocks.find(
      (block) => block.id === parentBlock.id,
    ) as Block;

    expect(updatedParentBlock.children).toEqual([
      parentBlock.children![0],
      childBlocks[0].id,
      childBlocks[1].id,
      ...parentBlock.children!.slice(1),
    ]);
  });
});
