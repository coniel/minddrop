import { Node } from '@minddrop/extension';
import { BoardDocument } from '../types';
import { removeNodesFromBoard } from '../removeNodesFromBoard';
import { MindDropApi } from '../../../../packages/extensions/src';

// Timeout ID to manage debounce delay
let debounceTimeout: NodeJS.Timeout | null = null;
// Array to hold the IDs of nodes to delete
let nodesToDelete: Node[] = [];
// Debounce delay in milliseconds
const debounceDelay = 20;

/**
 * Removes a node from the board.
 *
 * This function is debounced to allow multiple
 * calls to be batched into a single operation.
 *
 * @param API - The MindDrop API.
 * @param boardDocument - The current board content.
 * @param nodes - The nodes to remove from the board.
 * @returns The updated board content.
 */
export function removeNodeFromBoard(
  API: MindDropApi,
  board: BoardDocument,
  node: Node,
): void {
  // Add the node to the array of nodes to delete
  nodesToDelete.push(node);

  // If a debounce timeout is already set, clear it and reset
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }

  // Set a new timeout to call removeNodeFromBoard after the
  // debounce delay.
  debounceTimeout = setTimeout(() => {
    // Call the function to delete the nodes
    const updatedContent = removeNodesFromBoard(board.content!, nodesToDelete);

    // Clear the array after the nodes have been deleted
    nodesToDelete = [];

    // Update the board document with the new content
    API.Documents.update(board.path, { content: updatedContent });
  }, debounceDelay);
}
