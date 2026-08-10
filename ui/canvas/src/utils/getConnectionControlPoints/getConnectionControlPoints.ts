import {
  CONNECTION_CURVE_MAX_OFFSET,
  CONNECTION_CURVE_MIN_OFFSET,
} from '../../constants';
import { CanvasConnectionAnchor, CanvasPoint } from '../../types';
import { getSideNormal } from '../getSideNormal';

/**
 * Returns the cubic bezier control points of a connection curve.
 * Each control point extends perpendicular out of its anchor's
 * side, by a distance scaled with the anchor separation.
 *
 * @param from - The connection's source anchor.
 * @param to - The connection's target anchor.
 * @returns The two control points.
 */
export function getConnectionControlPoints(
  from: CanvasConnectionAnchor,
  to: CanvasConnectionAnchor,
): [CanvasPoint, CanvasPoint] {
  // Curve strength scales with the distance between the anchors,
  // clamped so short connections still curve and long ones don't
  // balloon
  const distance = Math.hypot(
    to.point.x - from.point.x,
    to.point.y - from.point.y,
  );
  const offset = Math.min(
    CONNECTION_CURVE_MAX_OFFSET,
    Math.max(CONNECTION_CURVE_MIN_OFFSET, distance / 2),
  );

  // Extend each control point out of its side
  const fromNormal = getSideNormal(from.side);
  const toNormal = getSideNormal(to.side);

  return [
    {
      x: from.point.x + fromNormal.x * offset,
      y: from.point.y + fromNormal.y * offset,
    },
    {
      x: to.point.x + toNormal.x * offset,
      y: to.point.y + toNormal.y * offset,
    },
  ];
}
