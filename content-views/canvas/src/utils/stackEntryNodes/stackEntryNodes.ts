import { ESTIMATED_NODE_HEIGHT, NODE_GAP } from '../../constants';
import { CanvasViewNode } from '../../types';
import { placeEntryNode } from '../placeEntryNode';

/**
 * Places entries on the canvas one below the other, the first at the
 * given point and each of the rest an estimated node height and a
 * gap further down.
 *
 * @param nodes - The canvas nodes.
 * @param entryIds - The IDs of the entries to place, in order.
 * @param point - The placement point of the first entry in canvas coordinates.
 * @returns The updated node list.
 */
export function stackEntryNodes(
  nodes: CanvasViewNode[],
  entryIds: string[],
  point: { x: number; y: number },
): CanvasViewNode[] {
  // Place each entry a node's height and a gap below the previous
  return entryIds.reduce(
    (updated, entryId, index) =>
      placeEntryNode(updated, entryId, {
        x: point.x,
        y: point.y + index * (ESTIMATED_NODE_HEIGHT + NODE_GAP),
      }),
    nodes,
  );
}
