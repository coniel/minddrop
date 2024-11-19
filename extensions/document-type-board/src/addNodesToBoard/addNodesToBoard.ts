import { Node } from '@minddrop/nodes';
import { BoardContent } from '../types';

/**
 * Adds nodes to the board content.
 *
 * @param boardContent - The current board content.
 * @param node - The nodes to add to the content.
 * @returns The updated board content.
 */
export function addNodesToBoard(
  boardContent: BoardContent,
  nodes: Node[],
): BoardContent {
  // Add the new nodes to the end of the board content nodes
  return {
    ...boardContent,
    nodes: [...boardContent.nodes, ...nodes],
  };
}
