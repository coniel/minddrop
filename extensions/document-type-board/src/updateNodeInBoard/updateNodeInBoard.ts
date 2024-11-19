import { Node } from '@minddrop/extension';
import { BoardContent } from '../types';

/**
 * Updates a node in the board content.
 * If the node is not found, the content is returned unchanged.
 *
 * @param boardDocument - The current board content.
 * @param updatedNode - The updated node.
 * @returns The updated board content.
 */
export function updateNodeInBoard(
  boardContent: BoardContent,
  updatedNode: Node,
): BoardContent {
  // Replace the target node with the updated node
  const updatedNodes = boardContent.nodes.map((node) =>
    node.id === updatedNode.id ? updatedNode : node,
  );

  // Update the content with the updated nodes
  return {
    ...boardContent,
    nodes: updatedNodes,
  };
}
