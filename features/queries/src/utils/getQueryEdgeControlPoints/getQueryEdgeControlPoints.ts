import { CanvasPoint } from '@minddrop/ui-canvas';

/**
 * Returns the cubic bezier control points of a connection edge
 * between two port points, curving horizontally out of the
 * ports.
 *
 * @param from - The point the edge starts from.
 * @param to - The point the edge leads to.
 *
 * @returns The bezier's four control points.
 */
export function getQueryEdgeControlPoints(
  from: CanvasPoint,
  to: CanvasPoint,
): [CanvasPoint, CanvasPoint, CanvasPoint, CanvasPoint] {
  // Curve strength grows with the horizontal distance
  const bend = Math.max(40, Math.min(160, Math.abs(to.x - from.x) / 2));

  return [
    from,
    { x: from.x + bend, y: from.y },
    { x: to.x - bend, y: to.y },
    to,
  ];
}
