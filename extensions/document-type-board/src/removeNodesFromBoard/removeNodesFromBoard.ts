import { GroupNode, Node } from '@minddrop/nodes';
import { BoardContent } from '../types';

/**
 * Removes nodes from the board.
 * If nodes do not apoear on the board, does nothing.
 *
 * @param boardDocument - The current board content.
 * @param nodes - The nodes to remove from the board.
 * @returns The updated board content.
 */
export function removeNodesFromBoard(
  boardContent: BoardContent,
  nodes: Node[],
): BoardContent {
  // Get the IDs of the nodes to remove
  const nodesToRemove = new Set(nodes.map((node) => node.id));
  // Filter out the nodes to remove from board nodes
  const updatedNodes = boardContent.nodes
    .filter((node) => !nodesToRemove.has(node.id))
    .map((node) => {
      // If the node is a group node, remove the nodes from its children
      if (node.type === 'group') {
        return {
          ...node,
          children: (node as GroupNode).children.filter(
            (childId) => !nodesToRemove.has(childId),
          ),
        };
      }

      return node;
    });

  return {
    ...boardContent,
    nodes: updatedNodes,
  };
}
