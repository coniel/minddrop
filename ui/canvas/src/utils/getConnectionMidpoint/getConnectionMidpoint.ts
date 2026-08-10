import { CanvasConnectionAnchor, CanvasPoint } from '../../types';
import { getConnectionControlPoints } from '../getConnectionControlPoints';

/**
 * Returns the midpoint of a connection curve in canvas
 * coordinates: the cubic bezier evaluated halfway along the
 * curve. Used to position UI (e.g. a toolbar) on a connection.
 *
 * @param from - The connection's source anchor.
 * @param to - The connection's target anchor.
 * @returns The curve's midpoint.
 */
export function getConnectionMidpoint(
  from: CanvasConnectionAnchor,
  to: CanvasConnectionAnchor,
): CanvasPoint {
  // The curve's control points
  const [c1, c2] = getConnectionControlPoints(from, to);

  // Cubic bezier evaluated at t = 0.5
  return {
    x: (from.point.x + 3 * c1.x + 3 * c2.x + to.point.x) / 8,
    y: (from.point.y + 3 * c1.y + 3 * c2.y + to.point.y) / 8,
  };
}
