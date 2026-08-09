import { DEFAULT_NODE_WIDTH } from '../../constants';
import { CanvasViewNode } from '../../types';

/**
 * Places an entry on the canvas at the given point: moves the
 * entry's node there when it is already placed, otherwise appends
 * a new node horizontally centered on the point.
 *
 * @param nodes - The canvas nodes.
 * @param entryId - The ID of the entry to place.
 * @param point - The placement point in canvas coordinates.
 * @returns The updated node list.
 */
export function placeEntryNode(
  nodes: CanvasViewNode[],
  entryId: string,
  point: { x: number; y: number },
): CanvasViewNode[] {
  const existing = nodes.find(
    (node) => node.type === 'entry' && node.id === entryId,
  );

  // Center the node horizontally on the point
  const x = Math.round(point.x - (existing?.width ?? DEFAULT_NODE_WIDTH) / 2);
  const y = Math.round(point.y);

  // Move the entry's existing node to the point
  if (existing) {
    return nodes.map((node) => {
      if (node !== existing) {
        return node;
      }

      return { ...node, x, y };
    });
  }

  // Append a new node for the entry
  return [
    ...nodes,
    { type: 'entry', id: entryId, x, y, width: DEFAULT_NODE_WIDTH },
  ];
}
