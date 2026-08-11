import {
  CanvasConnection,
  CanvasConnectionAnchor,
  CanvasNodeFrame,
} from '../../types';
import { getSideAnchorPoint } from '../getSideAnchorPoint';

/**
 * A connection's resolved endpoints.
 */
export interface CanvasConnectionAnchors {
  /**
   * The endpoint the connection is drawn from.
   */
  from: CanvasConnectionAnchor;

  /**
   * The endpoint the connection is drawn to.
   */
  to: CanvasConnectionAnchor;
}

/**
 * Resolves a connection's anchors against the registered node
 * frames, or null when either of its endpoint nodes is not
 * mounted on the canvas.
 *
 * @param connection - The connection to resolve.
 * @param nodes - The registered node frames keyed by node ID.
 * @returns The resolved anchors.
 */
export function getConnectionAnchors(
  connection: CanvasConnection,
  nodes: Record<string, CanvasNodeFrame>,
): CanvasConnectionAnchors | null {
  const fromFrame = nodes[connection.from.nodeId];
  const toFrame = nodes[connection.to.nodeId];

  if (!fromFrame || !toFrame) {
    return null;
  }

  return {
    from: {
      point: getSideAnchorPoint(
        fromFrame,
        connection.from.side,
        connection.from.offset,
      ),
      side: connection.from.side,
      frame: fromFrame,
    },
    to: {
      point: getSideAnchorPoint(
        toFrame,
        connection.to.side,
        connection.to.offset,
      ),
      side: connection.to.side,
      frame: toFrame,
    },
  };
}
