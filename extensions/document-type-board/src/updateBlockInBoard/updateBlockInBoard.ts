import { Block } from '@minddrop/extension';
import { BoardContent } from '../types';

/**
 * Updates a block in the board content.
 * If the block is not found, the content is returned unchanged.
 *
 * @param boardDocument - The current board content.
 * @param updatedBlock - The updated block.
 * @returns The updated board content.
 */
export function updateBlockInBoard(
  boardContent: BoardContent,
  updatedBlock: Block,
): BoardContent {
  // Replace the target block with the updated block
  const updatedBlocks = boardContent.blocks.map((block) =>
    block.id === updatedBlock.id ? updatedBlock : block,
  );

  // Update the content with the updated blocks
  return {
    ...boardContent,
    blocks: updatedBlocks,
  };
}
