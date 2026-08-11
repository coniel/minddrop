import { CanvasNodeFrame, CanvasPoint } from '../../types';

/**
 * Checks whether a canvas point lies within a frame, edges
 * included.
 *
 * @param point - The point in canvas coordinates.
 * @param frame - The frame in canvas coordinates.
 * @returns Whether the point lies within the frame.
 */
export function pointInFrame(
  point: CanvasPoint,
  frame: CanvasNodeFrame,
): boolean {
  return (
    point.x >= frame.x &&
    point.x <= frame.x + frame.width &&
    point.y >= frame.y &&
    point.y <= frame.y + frame.height
  );
}
