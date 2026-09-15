import {
  DEFAULT_NODE_WIDTH,
  ESTIMATED_NODE_HEIGHT,
  NODE_GAP,
  UNPLACED_ROW_SIZE,
  UNPLACED_SECTION_GAP,
} from '../../constants';
import { CanvasViewNode } from '../../types';

/**
 * Computes deterministic positions for unplaced entry nodes: a
 * grid of rows below the placed nodes' union bounding box,
 * aligned to its left edge. Starts at the origin when the canvas
 * is empty.
 *
 * @param placedNodes - The nodes already placed on the canvas.
 * @param count - The number of positions to compute.
 * @returns The computed positions, in placement order.
 */
export function getUnplacedNodePositions(
  placedNodes: CanvasViewNode[],
  count: number,
): { x: number; y: number }[] {
  // Union bounding box of the placed nodes
  let minX = Infinity;
  let maxY = -Infinity;

  placedNodes.forEach((node) => {
    minX = Math.min(minX, node.x);
    maxY = Math.max(maxY, node.y + (node.height ?? ESTIMATED_NODE_HEIGHT));
  });

  // Start at the origin when there are no placed nodes
  const startX = placedNodes.length ? minX : 0;
  const startY = placedNodes.length ? maxY + UNPLACED_SECTION_GAP : 0;

  // Lay the positions out in fixed-size rows
  return Array.from({ length: count }, (_, index) => ({
    x: startX + (index % UNPLACED_ROW_SIZE) * (DEFAULT_NODE_WIDTH + NODE_GAP),
    y:
      startY +
      Math.floor(index / UNPLACED_ROW_SIZE) *
        (ESTIMATED_NODE_HEIGHT + NODE_GAP),
  }));
}
