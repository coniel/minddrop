import { Query, QueryConnection, QueryNode } from '../../types';

export interface RemoveQueryNodeResult {
  /**
   * The nodes without the removed node.
   */
  nodes: QueryNode[];

  /**
   * The connections without those attached to the removed node.
   */
  connections: QueryConnection[];
}

/**
 * Removes a node and its connections from a query graph. The
 * source and results nodes cannot be removed.
 *
 * @param query - The query to remove the node from.
 * @param nodeId - The ID of the node to remove.
 *
 * @returns The updated nodes and connections.
 */
export function removeQueryNode(
  query: Query,
  nodeId: string,
): RemoveQueryNodeResult {
  const node = query.nodes.find((queryNode) => queryNode.id === nodeId);

  // The source and results nodes are permanent
  if (!node || node.type === 'source' || node.type === 'results') {
    return { nodes: query.nodes, connections: query.connections };
  }

  return {
    // Drop the node itself
    nodes: query.nodes.filter((queryNode) => queryNode.id !== nodeId),
    // Drop connections attached to the node on either end
    connections: query.connections.filter(
      (connection) => connection.from !== nodeId && connection.to !== nodeId,
    ),
  };
}
