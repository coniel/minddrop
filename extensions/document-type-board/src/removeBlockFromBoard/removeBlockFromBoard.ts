import { Block } from '@minddrop/extension';
import { BoardDocument } from '../types';
import { removeBlocksFromBoard } from '../removeBlocksFromBoard';
import { MindDropApi } from '../../../../packages/extensions/src';

// Timeout ID to manage debounce delay
let debounceTimeout: NodeJS.Timeout | null = null;
// Array to hold the IDs of blocks to delete
let blocksToDelete: Block[] = [];
// Debounce delay in milliseconds
const debounceDelay = 20;

/**
 * Removes a block from the board.
 *
 * This function is debounced to allow multiple
 * calls to be batched into a single operation.
 *
 * @param API - The MindDrop API.
 * @param boardDocument - The current board content.
 * @param blocks - The blocks to remove from the board.
 * @returns The updated board content.
 */
export function removeBlockFromBoard(
  API: MindDropApi,
  board: BoardDocument,
  block: Block,
): void {
  // Add the block to the array of blocks to delete
  blocksToDelete.push(block);

  // If a debounce timeout is already set, clear it and reset
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }

  // Set a new timeout to call removeBlockFromBoard after the
  // debounce delay.
  debounceTimeout = setTimeout(() => {
    // Call the function to delete the blocks
    const updatedContent = removeBlocksFromBoard(
      board.content!,
      blocksToDelete,
    );

    // Clear the array after the blocks have been deleted
    blocksToDelete = [];

    // Update the board document with the new content
    API.Documents.update(board.path, { content: updatedContent });
  }, debounceDelay);
}
