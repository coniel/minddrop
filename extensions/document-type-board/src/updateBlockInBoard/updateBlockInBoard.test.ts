import { describe, it, expect } from 'vitest';
import { updateBlockInBoard } from './updateBlockInBoard';
import { boardDocument, columnsBlock } from '../test-utils';

const updatedBlock = {
  ...columnsBlock,
  children: [...columnsBlock.children!, 'new-child'],
};

describe('updateBlockInBoard', () => {
  it('updates the block in the content', () => {
    const updatedContent = updateBlockInBoard(
      boardDocument.content,
      updatedBlock,
    );

    expect(updatedContent).toEqual({
      ...boardDocument.content,
      blocks: [updatedBlock, ...boardDocument.content.blocks.slice(1)],
    });
  });

  it('returns the content unchanged if the block is not found', () => {
    const updatedContent = updateBlockInBoard(boardDocument.content, {
      ...updatedBlock,
      id: 'unknown-id',
    });

    expect(updatedContent).toEqual(boardDocument.content);
  });
});
