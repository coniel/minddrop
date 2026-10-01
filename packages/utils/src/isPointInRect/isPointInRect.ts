import { Rect } from '../types';

/**
 * Checks whether a point lies within a box, its edges included.
 *
 * @param point - The point to check.
 * @param rect - The box, in the same coordinates as the point.
 * @returns Whether the point is within the box.
 */
export function isPointInRect(
  point: { x: number; y: number },
  rect: Rect,
): boolean {
  // Check the point against the box's horizontal and vertical extent
  return (
    point.x >= rect.left &&
    point.x <= rect.left + rect.width &&
    point.y >= rect.top &&
    point.y <= rect.top + rect.height
  );
}
