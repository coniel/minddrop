import { CanvasViewNode } from '../../types';

/**
 * Returns a new node list with the given node's position and
 * width updated. Returns the list unchanged when the node is not
 * in it.
 *
 * @param nodes - The canvas nodes.
 * @param nodeId - The ID of the node to update.
 * @param frame - The node's new position and width.
 * @returns The updated node list.
 */
export function updateNodeFrame(
  nodes: CanvasViewNode[],
  nodeId: string,
  frame: { x: number; y: number; width: number },
): CanvasViewNode[] {
  return nodes.map((node) => {
    // Leave other nodes untouched
    if (node.id !== nodeId) {
      return node;
    }

    return { ...node, x: frame.x, y: frame.y, width: frame.width };
  });
}
