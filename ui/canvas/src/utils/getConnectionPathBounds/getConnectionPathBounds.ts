import {
  CanvasConnectionAnchor,
  CanvasConnectionShape,
  CanvasNodeFrame,
} from '../../types';
import { getConnectionPathPoints } from '../getConnectionPathPoints';

/**
 * Returns the frame enclosing a connection's path. Curved shapes
 * are enclosed by their sampled points, so the frame follows the
 * curve rather than its control points.
 *
 * @param from - The connection's source anchor.
 * @param to - The connection's target anchor.
 * @param shape - The connection's path geometry, defaults to 'curved'.
 * @returns The frame enclosing the path.
 */
export function getConnectionPathBounds(
  from: CanvasConnectionAnchor,
  to: CanvasConnectionAnchor,
  shape?: CanvasConnectionShape,
): CanvasNodeFrame {
  const points = getConnectionPathPoints(from, to, shape);
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const left = Math.min(...xs);
  const top = Math.min(...ys);

  return {
    x: left,
    y: top,
    width: Math.max(...xs) - left,
    height: Math.max(...ys) - top,
  };
}
