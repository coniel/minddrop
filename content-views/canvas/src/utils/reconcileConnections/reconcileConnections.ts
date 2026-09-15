import { CanvasViewConnection, CanvasViewNode } from '../../types';

/**
 * Reconciles saved canvas connections with the reconciled nodes:
 * connections attached to a node no longer on the canvas (e.g.
 * whose entry was removed from the collection) are dropped.
 *
 * @param connections - The saved canvas connections.
 * @param nodes - The reconciled canvas nodes.
 * @returns The reconciled connections.
 */
export function reconcileConnections(
  connections: CanvasViewConnection[],
  nodes: CanvasViewNode[],
): CanvasViewConnection[] {
  const nodeIds = new Set(nodes.map((node) => node.id));

  // Keep connections whose both endpoints are on the canvas
  return connections.filter(
    (connection) =>
      nodeIds.has(connection.from.nodeId) && nodeIds.has(connection.to.nodeId),
  );
}
