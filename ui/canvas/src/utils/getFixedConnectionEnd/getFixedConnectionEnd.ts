import {
  CanvasConnection,
  CanvasConnectionEnd,
  CanvasNodeFrame,
  CanvasPoint,
} from '../../types';
import { getConnectionAnchors } from '../getConnectionAnchors';

/**
 * The anchored end of a re-connect drag.
 */
export interface FixedConnectionEnd {
  /**
   * The endpoint the drag stays anchored to.
   */
  end: CanvasConnectionEnd;

  /**
   * The anchored endpoint's point in canvas coordinates.
   */
  point: CanvasPoint;

  /**
   * The end being re-routed, which follows the cursor.
   */
  looseEnd: 'from' | 'to';
}

/**
 * Resolves the fixed end of a re-connect drag: the endpoint
 * nearer the grab point becomes the loose end following the
 * cursor, while the farther one stays anchored. Returns null when
 * either endpoint node is not mounted on the canvas.
 *
 * @param connection - The connection being re-routed.
 * @param point - The grab point in canvas coordinates.
 * @param nodes - The registered node frames keyed by node ID.
 * @returns The anchored end.
 */
export function getFixedConnectionEnd(
  connection: CanvasConnection,
  point: CanvasPoint,
  nodes: Record<string, CanvasNodeFrame>,
): FixedConnectionEnd | null {
  const anchors = getConnectionAnchors(connection, nodes);

  // Both endpoint frames must be registered
  if (!anchors) {
    return null;
  }

  // Distance from the grab point to each endpoint
  const fromDistance = Math.hypot(
    point.x - anchors.from.point.x,
    point.y - anchors.from.point.y,
  );
  const toDistance = Math.hypot(
    point.x - anchors.to.point.x,
    point.y - anchors.to.point.y,
  );

  // The nearer end detaches; the farther end stays anchored
  if (fromDistance <= toDistance) {
    return { end: connection.to, point: anchors.to.point, looseEnd: 'from' };
  }

  return { end: connection.from, point: anchors.from.point, looseEnd: 'to' };
}
