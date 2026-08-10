import { CanvasNodeFrame } from '../../types';

/**
 * Returns whether two frames overlap, counting frames that only
 * touch along an edge.
 *
 * @param frame - The first frame in canvas coordinates.
 * @param other - The second frame in canvas coordinates.
 * @returns Whether the frames overlap.
 */
export function framesIntersect(
  frame: CanvasNodeFrame,
  other: CanvasNodeFrame,
): boolean {
  return (
    frame.x <= other.x + other.width &&
    frame.x + frame.width >= other.x &&
    frame.y <= other.y + other.height &&
    frame.y + frame.height >= other.y
  );
}
