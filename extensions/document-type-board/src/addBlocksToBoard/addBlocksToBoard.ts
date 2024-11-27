import { Block } from '@minddrop/extension';
import { BoardContent } from '../types';

/**
 * Adds blocks to the board content.
 *
 * @param boardContent - The current board content.
 * @param block - The blocks to add to the content.
 * @returns The updated board content.
 */
export function addBlocksToBoard(
  boardContent: BoardContent,
  blocks: Block[],
): BoardContent {
  // Add the new blocks to the end of the board content blocks
  return {
    ...boardContent,
    blocks: [...boardContent.blocks, ...blocks],
  };
}
