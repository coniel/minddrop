import { CanvasNodeSide, CanvasPoint } from '../../types';

/** Outward unit normal of each node side. */
const SIDE_NORMALS: Record<CanvasNodeSide, CanvasPoint> = {
  top: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  bottom: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
};

/**
 * Returns the outward unit normal of a node side.
 *
 * @param side - The node side.
 * @returns The side's outward unit normal.
 */
export function getSideNormal(side: CanvasNodeSide): CanvasPoint {
  return SIDE_NORMALS[side];
}
