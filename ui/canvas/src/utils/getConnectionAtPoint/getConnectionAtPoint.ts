import { CanvasConnection, CanvasNodeFrame, CanvasPoint } from '../../types';
import { getConnectionPathPoints } from '../getConnectionPathPoints';
import { getSideAnchorPoint } from '../getSideAnchorPoint';

/**
 * Finds the connection whose path passes within the given
 * distance of a canvas point, measured against the path sampled
 * into a polyline. Connections whose endpoint nodes are missing
 * from the registry are skipped.
 *
 * @param connections - The connections to test.
 * @param nodes - The node frames the connections anchor to.
 * @param point - The point in canvas coordinates.
 * @param threshold - The maximum distance to a path.
 * @returns The closest connection within threshold, or null.
 */
export function getConnectionAtPoint(
  connections: CanvasConnection[],
  nodes: Record<string, CanvasNodeFrame>,
  point: CanvasPoint,
  threshold: number,
): CanvasConnection | null {
  // The closest path found so far
  let closest: CanvasConnection | null = null;
  let closestDistance = threshold;

  connections.forEach((connection) => {
    const fromFrame = nodes[connection.from.nodeId];
    const toFrame = nodes[connection.to.nodeId];

    // Skip connections whose endpoint nodes are missing
    if (!fromFrame || !toFrame) {
      return;
    }

    // The path's sampled polyline between the resolved anchors
    const pathPoints = getConnectionPathPoints(
      {
        point: getSideAnchorPoint(
          fromFrame,
          connection.from.side,
          connection.from.offset,
        ),
        side: connection.from.side,
        frame: fromFrame,
      },
      {
        point: getSideAnchorPoint(
          toFrame,
          connection.to.side,
          connection.to.offset,
        ),
        side: connection.to.side,
        frame: toFrame,
      },
      connection.shape,
    );

    const distance = distanceToPolyline(point, pathPoints);

    // Track the closest path within the threshold
    if (distance <= closestDistance) {
      closest = connection;
      closestDistance = distance;
    }
  });

  return closest;
}

/**
 * Returns the distance from a point to a polyline: the minimum
 * distance to any of its segments.
 */
function distanceToPolyline(
  point: CanvasPoint,
  pathPoints: CanvasPoint[],
): number {
  // The closest segment found so far
  let minimum = Infinity;

  // Walk the polyline's segments
  for (let index = 1; index < pathPoints.length; index += 1) {
    minimum = Math.min(
      minimum,
      distanceToSegment(point, pathPoints[index - 1], pathPoints[index]),
    );
  }

  return minimum;
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
