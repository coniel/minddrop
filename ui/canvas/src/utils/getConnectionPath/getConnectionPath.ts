import {
  CanvasConnectionAnchor,
  CanvasConnectionShape,
  CanvasPoint,
} from '../../types';
import { getConnectionControlPoints } from '../getConnectionControlPoints';
import { getElbowConnectionPoints } from '../getElbowConnectionPoints';
import { getSideNormal } from '../getSideNormal';

export interface ConnectionPathOptions {
  /**
   * Distance to trim off the path at the source anchor, along the
   * path's leaving direction. Used to end the stroke behind a
   * start arrowhead instead of poking through its tip.
   */
  trimStart?: number;

  /**
   * Distance to trim off the path at the target anchor, along the
   * path's arriving direction. Used to end the stroke behind an
   * end arrowhead instead of poking through its tip.
   */
  trimEnd?: number;
}

/**
 * Returns the SVG path data of a connection between two anchors,
 * drawn with the given shape: a cubic bezier curving
 * perpendicular out of each anchor's side, axis-aligned segments
 * with sharp corners, or a direct line between the anchors.
 *
 * @param from - The connection's source anchor.
 * @param to - The connection's target anchor.
 * @param shape - The path geometry, defaults to 'curved'.
 * @param options - Path trimming options.
 * @returns The SVG path data string.
 */
export function getConnectionPath(
  from: CanvasConnectionAnchor,
  to: CanvasConnectionAnchor,
  shape: CanvasConnectionShape = 'curved',
  options: ConnectionPathOptions = {},
): string {
  const { trimStart = 0, trimEnd = 0 } = options;

  // A direct line between the anchors, trimmed along itself
  if (shape === 'direct') {
    const length = Math.hypot(
      to.point.x - from.point.x,
      to.point.y - from.point.y,
    );
    const unit: CanvasPoint = length
      ? {
          x: (to.point.x - from.point.x) / length,
          y: (to.point.y - from.point.y) / length,
        }
      : { x: 0, y: 0 };
    const start = {
      x: from.point.x + unit.x * trimStart,
      y: from.point.y + unit.y * trimStart,
    };
    const end = {
      x: to.point.x - unit.x * trimEnd,
      y: to.point.y - unit.y * trimEnd,
    };

    return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
  }

  // Axis-aligned segments with sharp corners, trimmed along the
  // outer segments
  if (shape === 'straight') {
    return pointsToPath(
      trimPoints(getElbowConnectionPoints(from, to), trimStart, trimEnd),
    );
  }

  // The curve's control points
  const [c1, c2] = getConnectionControlPoints(from, to);

  // The curve's endpoint tangents run along the side normals, so
  // trims move the endpoints out along them
  const fromNormal = getSideNormal(from.side);
  const toNormal = getSideNormal(to.side);
  const start = {
    x: from.point.x + fromNormal.x * trimStart,
    y: from.point.y + fromNormal.y * trimStart,
  };
  const end = {
    x: to.point.x + toNormal.x * trimEnd,
    y: to.point.y + toNormal.y * trimEnd,
  };

  return `M ${start.x} ${start.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${end.x} ${end.y}`;
}

/**
 * Trims a route's first and last segments by moving the end
 * points inward, clamped to the segment lengths.
 */
function trimPoints(
  points: CanvasPoint[],
  trimStart: number,
  trimEnd: number,
): CanvasPoint[] {
  // Nothing to trim on degenerate routes
  if (points.length < 2) {
    return points;
  }

  const result = [...points];

  // Move the first point toward its neighbour
  if (trimStart > 0) {
    result[0] = movePointToward(result[0], result[1], trimStart);
  }

  // Move the last point toward its neighbour
  if (trimEnd > 0) {
    result[result.length - 1] = movePointToward(
      result[result.length - 1],
      result[result.length - 2],
      trimEnd,
    );
  }

  return result;
}

/**
 * Moves a point toward a target by a distance, clamped to the
 * distance between them.
 */
function movePointToward(
  point: CanvasPoint,
  toward: CanvasPoint,
  distance: number,
): CanvasPoint {
  const length = Math.hypot(toward.x - point.x, toward.y - point.y);

  // The points coincide
  if (!length) {
    return point;
  }

  const clamped = Math.min(distance, length);

  return {
    x: point.x + ((toward.x - point.x) / length) * clamped,
    y: point.y + ((toward.y - point.y) / length) * clamped,
  };
}

/**
 * Joins route points into SVG path data.
 */
function pointsToPath(points: CanvasPoint[]): string {
  return points.reduce(
    (path, point, index) =>
      index === 0
        ? `M ${point.x} ${point.y}`
        : `${path} L ${point.x} ${point.y}`,
    '',
  );
}
