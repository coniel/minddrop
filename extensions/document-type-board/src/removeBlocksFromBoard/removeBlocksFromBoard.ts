import { Block } from '@minddrop/extension';
import { BoardContent } from '../types';

/**
 * Removes blocks from the board.
 * If blocks do not apoear on the board, does nothing.
 *
 * @param boardDocument - The current board content.
 * @param blocks - The blocks to remove from the board.
 * @returns The updated board content.
 */
export function removeBlocksFromBoard(
  boardContent: BoardContent,
  blocks: Block[],
): BoardContent {
  // Get the IDs of the blocks to remove
  const blocksToRemove = new Set(blocks.map((block) => block.id));
  // Filter out the blocks to remove from board blocks
  const updatedBlocks = boardContent.blocks
    .filter((block) => !blocksToRemove.has(block.id))
    .map((block) => {
      // If the block is a layout block with children, remove the
      // blocks from its children.
      if (block.children) {
        return {
          ...block,
          children:
            block.children?.filter((childId) => !blocksToRemove.has(childId)) ||
            [],
        };
      }

      return block;
    });

  return {
    ...boardContent,
    blocks: updatedBlocks,
  };
}
