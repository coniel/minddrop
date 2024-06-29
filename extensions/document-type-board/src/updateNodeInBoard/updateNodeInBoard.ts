import { Node } from '@minddrop/nodes';
import { BoardDocument } from '../types';
import { getBoardContent } from '../getBoardContent';
import { stringifyBoard } from '../stringifyBoard';

/**
 * Updates a node in the board document.
 * If the node is not found, the board document is returned unchanged.
 *
 * @param boardDocument - The board document.
 * @param updatedNode - The updated node.
 * @returns The updated board document.
 */
export function updateNodeInBoard(
  boardDocument: BoardDocument,
  updatedNode: Node,
): BoardDocument {
  // Get the current board content
  const content = getBoardContent(boardDocument);

  // Replace the node with the updated node
  const updatedNodes = content.nodes.map((node) =>
    node.id === updatedNode.id ? updatedNode : node,
  );

  // Update the content with the updated nodes
  const updatedContent = {
    ...content,
    nodes: updatedNodes,
  };

  // Stringify the updated board
  const fileTextContent = stringifyBoard({
    ...boardDocument,
    content: updatedContent,
  });

  // Merge the updated content with the board document
  return {
    ...boardDocument,
    content: updatedContent,
    fileTextContent,
  };
}
