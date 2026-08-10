import { CanvasNodeFrame, CanvasPoint } from '../../types';

/**
 * Returns the frame spanning two corner points, normalised so its
 * width and height are always positive.
 *
 * @param a - The first corner in canvas coordinates.
 * @param b - The opposite corner in canvas coordinates.
 * @returns The frame spanning the two corners.
 */
export function getFrameFromPoints(
  a: CanvasPoint,
  b: CanvasPoint,
): CanvasNodeFrame {
  return {
    x: Math.min(a.x, b.x),
    y: Math.min(a.y, b.y),
    width: Math.abs(b.x - a.x),
    height: Math.abs(b.y - a.y),
  };
}
