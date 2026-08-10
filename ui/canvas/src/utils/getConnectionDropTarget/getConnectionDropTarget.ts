import {
  CanvasConnectionDragTarget,
  CanvasNodeFrame,
  CanvasPoint,
} from '../../types';
import { getNearestSide } from '../getNearestSide';

/**
 * Resolves a connection drag's drop target: the registered node
 * nearest the cursor within the given proximity, attaching to its
 * side nearest the cursor. The cursor does not need to touch the
 * node, frames within the proximity snap as targets. The drag's
 * anchored node is excluded, since a connection cannot target its
 * own anchor.
 *
 * @param nodes - The registered node frames keyed by node ID.
 * @param point - The cursor position in canvas coordinates.
 * @param excludeNodeId - The ID of the drag's anchored node.
 * @param threshold - The maximum distance to a frame, in canvas units.
 * @returns The nearby target, or null when none is in reach.
 */
export function getConnectionDropTarget(
  nodes: Record<string, CanvasNodeFrame>,
  point: CanvasPoint,
  excludeNodeId: string,
  threshold: number,
): CanvasConnectionDragTarget | null {
  let nearest: {
    nodeId: string;
    frame: CanvasNodeFrame;
    distance: number;
  } | null = null;

  for (const [nodeId, frame] of Object.entries(nodes)) {
    // A connection cannot target the drag's own anchored node
    if (nodeId === excludeNodeId) {
      continue;
    }

    // Distance from the cursor to the frame, zero inside it
    const distanceX = Math.max(
      frame.x - point.x,
      point.x - (frame.x + frame.width),
      0,
    );
    const distanceY = Math.max(
      frame.y - point.y,
      point.y - (frame.y + frame.height),
      0,
    );
    const distance = Math.hypot(distanceX, distanceY);

    // The frame is out of reach
    if (distance > threshold) {
      continue;
    }

    // Keep the nearest frame
    if (!nearest || distance < nearest.distance) {
      nearest = { nodeId, frame, distance };
    }
  }

  // No frame is within reach of the cursor
  if (!nearest) {
    return null;
  }

  // Attach to the target side nearest the cursor
  return {
    nodeId: nearest.nodeId,
    side: getNearestSide(nearest.frame, point),
  };
}
