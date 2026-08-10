import { QueryConnection } from '../../types';

/**
 * Removes all of a node's incoming and outgoing connections
 * from a query graph's connections. Returns the connections
 * unchanged (same reference) when the node has none.
 *
 * @param connections - The query's connections.
 * @param nodeId - The ID of the node whose connections to remove.
 *
 * @returns The updated connections.
 */
export function removeQueryNodeConnections(
  connections: QueryConnection[],
  nodeId: string,
): QueryConnection[] {
  // Drop the connections attached to the node
  const remaining = connections.filter(
    (connection) => connection.from !== nodeId && connection.to !== nodeId,
  );

  // Preserve the reference when nothing was removed so callers
  // can skip persisting
  if (remaining.length === connections.length) {
    return connections;
  }

  return remaining;
}
