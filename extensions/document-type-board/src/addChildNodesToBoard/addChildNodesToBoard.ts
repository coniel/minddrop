import { GroupNode, Node } from '@minddrop/nodes';
import { BoardContent } from '../types';
import { addNodesToBoard } from '../addNodesToBoard';
import { updateNodeInBoard } from '../updateNodeInBoard';

/**
 * Adds child nodes to the board content and updates the parent node
 * to include the child nodes in its children array.
 *
 * @param boardContent - The current board content.
 * @param parentNode - The parent node to add the child nodes to.
 * @param childNodes - The child nodes to add to the board.
 * @param index - The index to insert the child nodes at, defaults to the end.
 * @returns The updated board document.
 */
export function addChildNodesToBoard(
  boardContent: BoardContent,
  parentNode: GroupNode,
  childNodes: Node[],
  index?: number,
): BoardContent {
  // Add the child nodes to the board content
  let updatedContent = addNodesToBoard(boardContent, childNodes);

  // Add child nodes IDs to parent's children at the specified index
  // or to the end of the children array.
  const newChildren = [...parentNode.children];
  newChildren.splice(
    index || parentNode.children.length,
    0,
    ...childNodes.map((node) => node.id),
  );

  // Update he parent node in the board content
  return updateNodeInBoard(updatedContent, {
    ...parentNode,
    children: newChildren,
  });
}
