import {
  CanvasConnectionAnchor,
  CanvasConnectionShape,
  CanvasNodeFrame,
  CanvasPoint,
} from '../../types';
import { framesIntersect } from '../framesIntersect';
import { getConnectionPathBounds } from '../getConnectionPathBounds';
import { getConnectionPathPoints } from '../getConnectionPathPoints';

/**
 * Returns whether a connection's path passes through a frame,
 * counting a path that only crosses it without either endpoint
 * being inside.
 *
 * @param from - The connection's source anchor.
 * @param to - The connection's target anchor.
 * @param shape - The connection's path geometry, defaults to 'curved'.
 * @param frame - The frame to test against, in canvas coordinates.
 * @returns Whether the connection's path touches the frame.
 */
export function connectionIntersectsFrame(
  from: CanvasConnectionAnchor,
  to: CanvasConnectionAnchor,
  shape: CanvasConnectionShape | undefined,
  frame: CanvasNodeFrame,
): boolean {
  // Cheap reject against the path's bounds before testing every
  // segment
  if (!framesIntersect(getConnectionPathBounds(from, to, shape), frame)) {
    return false;
  }

  // The path approximated as a polyline
  const points = getConnectionPathPoints(from, to, shape);

  // Any segment crossing the frame makes the connection a hit
  return points.some((point, index) => {
    const next = points[index + 1];

    return next ? segmentIntersectsFrame(point, next, frame) : false;
  });
}

/**
 * Returns whether a line segment touches a frame, either by
 * having an endpoint inside it or by crossing one of its edges.
 */
function segmentIntersectsFrame(
  a: CanvasPoint,
  b: CanvasPoint,
  frame: CanvasNodeFrame,
): boolean {
  // An endpoint inside the frame is a hit without further testing
  if (containsPoint(frame, a) || containsPoint(frame, b)) {
    return true;
  }

  const left = frame.x;
  const right = frame.x + frame.width;
  const top = frame.y;
  const bottom = frame.y + frame.height;

  // Otherwise the segment must cross one of the frame's edges
  return (
    segmentsIntersect(a, b, { x: left, y: top }, { x: right, y: top }) ||
    segmentsIntersect(a, b, { x: right, y: top }, { x: right, y: bottom }) ||
    segmentsIntersect(a, b, { x: right, y: bottom }, { x: left, y: bottom }) ||
    segmentsIntersect(a, b, { x: left, y: bottom }, { x: left, y: top })
  );
}

/**
 * Returns whether a point lies within a frame.
 */
function containsPoint(frame: CanvasNodeFrame, point: CanvasPoint): boolean {
  return (
    point.x >= frame.x &&
    point.x <= frame.x + frame.width &&
    point.y >= frame.y &&
    point.y <= frame.y + frame.height
  );
}

/**
 * Returns whether two line segments cross, using the sign of the
 * cross products of their endpoints.
 */
function segmentsIntersect(
  a1: CanvasPoint,
  a2: CanvasPoint,
  b1: CanvasPoint,
  b2: CanvasPoint,
): boolean {
  const d1 = cross(b1, b2, a1);
  const d2 = cross(b1, b2, a2);
  const d3 = cross(a1, a2, b1);
  const d4 = cross(a1, a2, b2);

  // The segments cross when each straddles the other's line
  return (
    ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) &&
    ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))
  );
}

/**
 * Returns the cross product of the vectors from the first point
 * to each of the other two, giving which side of the line the
 * third point falls on.
 */
function cross(a: CanvasPoint, b: CanvasPoint, point: CanvasPoint): number {
  return (b.x - a.x) * (point.y - a.y) - (b.y - a.y) * (point.x - a.x);
}
