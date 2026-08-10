import { CanvasNodeFrame, CanvasNodeSide, CanvasPoint } from '../../types';
import { getSideMidpoint } from '../getSideMidpoint';

/** All node sides, in evaluation order. */
const SIDES: CanvasNodeSide[] = ['top', 'right', 'bottom', 'left'];

/**
 * Returns the side of a node frame whose midpoint lies closest to
 * a point.
 *
 * @param frame - The node frame.
 * @param point - The point in canvas coordinates.
 * @returns The nearest side.
 */
export function getNearestSide(
  frame: CanvasNodeFrame,
  point: CanvasPoint,
): CanvasNodeSide {
  // Track the side whose midpoint lies closest to the point
  let nearest: CanvasNodeSide = 'top';
  let nearestDistance = Infinity;

  SIDES.forEach((side) => {
    const midpoint = getSideMidpoint(frame, side);

    // Squared distance, ordering does not need the square root
    const distance = (midpoint.x - point.x) ** 2 + (midpoint.y - point.y) ** 2;

    // Keep the closest side so far
    if (distance < nearestDistance) {
      nearest = side;
      nearestDistance = distance;
    }
  });

  return nearest;
}
