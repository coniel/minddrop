import { Node } from '@minddrop/nodes';
import { BoardDocument } from '../types';
import { getBoardContent } from '../getBoardContent';
import { stringifyBoard } from '../stringifyBoard';

/**
 * Adds nodes to a board document and returns the updated board.
 *
 * @param board - The board document to add a node to.
 * @param node - The nodes to add to the board.
 * @returns The updated board document.
 */
export function addNodesToBoard(
  board: BoardDocument,
  nodes: Node[],
): BoardDocument {
  // Get the current board content
  const content = getBoardContent(board);

  // Add the new nodes to the end of the board content nodes
  const newContent = {
    ...content,
    nodes: [...content.nodes, ...nodes],
  };

  // Stringify the updated board
  const fileTextContent = stringifyBoard({
    ...board,
    content: newContent,
  });

  // Merge the new content with the board document
  return {
    ...board,
    content: newContent,
    fileTextContent,
  };
}
