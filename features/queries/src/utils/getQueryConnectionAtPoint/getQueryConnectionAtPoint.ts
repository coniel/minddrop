import { Query, QueryConnection } from '@minddrop/queries';
import { CanvasPoint } from '@minddrop/ui-canvas';
import { QUERY_NODE_PORT_Y, QUERY_NODE_WIDTHS } from '../../constants';
import { getQueryEdgeControlPoints } from '../getQueryEdgeControlPoints';

// Number of segments each edge is sampled into for the
// distance check
const SAMPLE_SEGMENTS = 32;

/**
 * Finds the connection whose edge passes within the given
 * distance of a canvas point, based on the nodes' persisted
 * positions.
 *
 * @param query - The query containing the connections.
 * @param point - The point in canvas coordinates.
 * @param tolerance - The maximum distance to an edge.
 *
 * @returns The closest connection within tolerance, or null.
 */
export function getQueryConnectionAtPoint(
  query: Query,
  point: CanvasPoint,
  tolerance = 12,
): QueryConnection | null {
  // The closest edge found so far
  let closest: QueryConnection | null = null;
  let closestDistance = tolerance;

  query.connections.forEach((connection) => {
    const fromNode = query.nodes.find((node) => node.id === connection.from);
    const toNode = query.nodes.find((node) => node.id === connection.to);

    // Skip edges with missing endpoints
    if (!fromNode || !toNode) {
      return;
    }

    // The ports the edge spans between
    const from = {
      x: fromNode.x + QUERY_NODE_WIDTHS[fromNode.type],
      y: fromNode.y + QUERY_NODE_PORT_Y,
    };
    const to = { x: toNode.x, y: toNode.y + QUERY_NODE_PORT_Y };

    const distance = distanceToEdge(point, from, to);

    // Track the closest edge within the tolerance
    if (distance <= closestDistance) {
      closest = connection;
      closestDistance = distance;
    }
  });

  return closest;
}

/**
 * Returns the approximate distance from a point to an edge's
 * bezier curve, measured against the curve sampled into a
 * polyline.
 */
function distanceToEdge(
  point: CanvasPoint,
  from: CanvasPoint,
  to: CanvasPoint,
): number {
  const controlPoints = getQueryEdgeControlPoints(from, to);

  // The closest sampled segment found so far
  let minimum = Infinity;

  // Walk the curve's sampled segments
  let previous = from;

  for (let step = 1; step <= SAMPLE_SEGMENTS; step += 1) {
    const sample = cubicBezierPoint(controlPoints, step / SAMPLE_SEGMENTS);

    minimum = Math.min(minimum, distanceToSegment(point, previous, sample));
    previous = sample;
  }

  return minimum;
}

/**
 * Returns the point at position t along a cubic bezier curve.
 */
function cubicBezierPoint(
  [p0, p1, p2, p3]: [CanvasPoint, CanvasPoint, CanvasPoint, CanvasPoint],
  t: number,
): CanvasPoint {
  const u = 1 - t;

  // Cubic bezier basis polynomial weights
  const w0 = u * u * u;
  const w1 = 3 * u * u * t;
  const w2 = 3 * u * t * t;
  const w3 = t * t * t;

  return {
    x: w0 * p0.x + w1 * p1.x + w2 * p2.x + w3 * p3.x,
    y: w0 * p0.y + w1 * p1.y + w2 * p2.y + w3 * p3.y,
  };
}

/**
 * Returns the distance from a point to a line segment.
 */
function distanceToSegment(
  point: CanvasPoint,
  start: CanvasPoint,
  end: CanvasPoint,
): number {
  const segmentX = end.x - start.x;
  const segmentY = end.y - start.y;
  const lengthSquared = segmentX * segmentX + segmentY * segmentY;

  // Zero length segments measure to their single point
  if (lengthSquared === 0) {
    return Math.hypot(point.x - start.x, point.y - start.y);
  }

  // Project the point onto the segment, clamped to its ends
  const t = Math.max(
    0,
    Math.min(
      1,
      ((point.x - start.x) * segmentX + (point.y - start.y) * segmentY) /
        lengthSquared,
    ),
  );

  return Math.hypot(
    point.x - (start.x + t * segmentX),
    point.y - (start.y + t * segmentY),
  );
}
