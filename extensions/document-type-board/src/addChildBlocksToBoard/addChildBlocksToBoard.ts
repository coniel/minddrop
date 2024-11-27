import { Block } from '@minddrop/extension';
import { BoardContent } from '../types';
import { addBlocksToBoard } from '../addBlocksToBoard';
import { updateBlockInBoard } from '../updateBlockInBoard';

/**
 * Adds child blocks to the board content and updates the parent block
 * to include the child blocks in its children array.
 *
 * @param boardContent - The current board content.
 * @param parentBlock - The parent block to add the child blocks to.
 * @param childBlocks - The child blocks to add to the board.
 * @param index - The index to insert the child blocks at, defaults to the end.
 * @returns The updated board document.
 */
export function addChildBlocksToBoard(
  boardContent: BoardContent,
  parentBlock: Block,
  childBlocks: Block[],
  index?: number,
): BoardContent {
  // Add the child blocks to the board content
  let updatedContent = addBlocksToBoard(boardContent, childBlocks);

  // Add child blocks IDs to parent's children at the specified index
  // or to the end of the children array.
  const newChildren = [...(parentBlock.children || [])];
  newChildren.splice(
    index || parentBlock.children?.length || 0,
    0,
    ...childBlocks.map((block) => block.id),
  );

  // Update he parent block in the board content
  return updateBlockInBoard(updatedContent, {
    ...parentBlock,
    children: newChildren,
  });
}
