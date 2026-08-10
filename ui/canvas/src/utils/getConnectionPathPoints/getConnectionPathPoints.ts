import { CONNECTION_HIT_SAMPLES } from '../../constants';
import {
  CanvasConnectionAnchor,
  CanvasConnectionShape,
  CanvasPoint,
} from '../../types';
import { getConnectionControlPoints } from '../getConnectionControlPoints';
import { getElbowConnectionPoints } from '../getElbowConnectionPoints';

/**
 * Returns a connection's path as a polyline, sampling curved
 * shapes along their bezier. For geometry that only needs an
 * approximation of the curve, such as hit testing and bounds.
 *
 * @param from - The connection's source anchor.
 * @param to - The connection's target anchor.
 * @param shape - The connection's path geometry, defaults to 'curved'.
 * @returns The points along the path, including both endpoints.
 */
export function getConnectionPathPoints(
  from: CanvasConnectionAnchor,
  to: CanvasConnectionAnchor,
  shape?: CanvasConnectionShape,
): CanvasPoint[] {
  // Axis-aligned routes are already a polyline
  if (shape === 'straight') {
    return getElbowConnectionPoints(from, to);
  }

  // Direct connections are a single segment
  if (shape === 'direct') {
    return [from.point, to.point];
  }

  const [control1, control2] = getConnectionControlPoints(from, to);

  // Sample the cubic bezier at evenly spaced values of t
  return Array.from({ length: CONNECTION_HIT_SAMPLES + 1 }, (_, index) =>
    getBezierPoint(
      from.point,
      control1,
      control2,
      to.point,
      index / CONNECTION_HIT_SAMPLES,
    ),
  );
}

/**
 * Returns the point on a cubic bezier at the given position along
 * the curve.
 */
function getBezierPoint(
  start: CanvasPoint,
  control1: CanvasPoint,
  control2: CanvasPoint,
  end: CanvasPoint,
  t: number,
): CanvasPoint {
  const inverse = 1 - t;

  // The four cubic bernstein basis weights at t
  const startWeight = inverse * inverse * inverse;
  const control1Weight = 3 * inverse * inverse * t;
  const control2Weight = 3 * inverse * t * t;
  const endWeight = t * t * t;

  return {
    x:
      start.x * startWeight +
      control1.x * control1Weight +
      control2.x * control2Weight +
      end.x * endWeight,
    y:
      start.y * startWeight +
      control1.y * control1Weight +
      control2.y * control2Weight +
      end.y * endWeight,
  };
}
