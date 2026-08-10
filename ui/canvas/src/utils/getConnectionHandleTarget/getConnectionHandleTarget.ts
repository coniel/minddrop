import { CanvasConnectionEnd, CanvasNodeFrame, CanvasPoint } from '../../types';
import { getProximitySide } from '../getProximitySide';

/**
 * Returns the node side whose edge lies within the threshold
 * distance of a point, hit-testing all registered node frames.
 * When edges of several nodes are within the threshold, the
 * closest one wins.
 *
 * @param nodes - The registered node frames keyed by node ID.
 * @param point - The point in canvas coordinates.
 * @param threshold - The maximum distance from an edge.
 * @returns The nearby node side, or null when none is close enough.
 */
export function getConnectionHandleTarget(
  nodes: Record<string, CanvasNodeFrame>,
  point: CanvasPoint,
  threshold: number,
): CanvasConnectionEnd | null {
  // Track the closest edge within the threshold across all nodes
  let nearest: CanvasConnectionEnd | null = null;
  let nearestDistance = Infinity;

  Object.entries(nodes).forEach(([nodeId, frame]) => {
    // Skip nodes the point is not in or near
    if (
      point.x < frame.x - threshold ||
      point.x > frame.x + frame.width + threshold ||
      point.y < frame.y - threshold ||
      point.y > frame.y + frame.height + threshold
    ) {
      return;
    }

    // The node's nearest edge within the threshold
    const proximity = getProximitySide(
      { width: frame.width, height: frame.height },
      { x: point.x - frame.x, y: point.y - frame.y },
      threshold,
    );

    // Keep the closest edge so far
    if (proximity && proximity.distance < nearestDistance) {
      nearest = { nodeId, side: proximity.side };
      nearestDistance = proximity.distance;
    }
  });

  return nearest;
}
