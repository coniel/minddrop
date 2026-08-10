import { CanvasNodeSide, CanvasPoint } from '../../types';

/** All node sides, in evaluation order. */
const SIDES: CanvasNodeSide[] = ['top', 'right', 'bottom', 'left'];

/**
 * A side within proximity of a point, with its distance.
 */
export interface CanvasProximitySide {
  /**
   * The nearby side.
   */
  side: CanvasNodeSide;

  /**
   * The distance from the point to the side's edge.
   */
  distance: number;
}

/**
 * Returns the side of a box whose edge lies within the threshold
 * distance of a point, or null when no edge is close enough.
 * When multiple edges are within the threshold (near a corner),
 * the closest one wins.
 *
 * @param size - The box size.
 * @param point - The point in box-local coordinates.
 * @param threshold - The maximum distance from an edge.
 * @returns The nearby side and its distance, or null.
 */
export function getProximitySide(
  size: { width: number; height: number },
  point: CanvasPoint,
  threshold: number,
): CanvasProximitySide | null {
  // Distance from the point to each side's edge line
  const distances: Record<CanvasNodeSide, number> = {
    top: Math.abs(point.y),
    right: Math.abs(size.width - point.x),
    bottom: Math.abs(size.height - point.y),
    left: Math.abs(point.x),
  };

  // Track the closest side within the threshold
  let nearest: CanvasNodeSide | null = null;
  let nearestDistance = Infinity;

  SIDES.forEach((side) => {
    if (distances[side] <= threshold && distances[side] < nearestDistance) {
      nearest = side;
      nearestDistance = distances[side];
    }
  });

  return nearest ? { side: nearest, distance: nearestDistance } : null;
}
