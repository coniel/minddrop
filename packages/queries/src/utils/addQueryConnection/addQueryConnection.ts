import { entityId } from '@minddrop/utils';
import { Query, QueryConnection } from '../../types';

/**
 * Adds a connection between two query graph nodes, returning
 * the updated connections.
 *
 * Invalid connections leave the connections unchanged: self
 * connections, duplicates, connections out of the results node,
 * connections into a source node, connections involving missing
 * nodes, and connections which would create a cycle.
 *
 * @param query - The query to connect the nodes in.
 * @param from - The ID of the node the connection starts from.
 * @param to - The ID of the node the connection leads to.
 *
 * @returns The updated connections.
 */
export function addQueryConnection(
  query: Query,
  from: string,
  to: string,
): QueryConnection[] {
  // Nodes cannot connect to themselves
  if (from === to) {
    return query.connections;
  }

  const fromNode = query.nodes.find((node) => node.id === from);
  const toNode = query.nodes.find((node) => node.id === to);

  // Both endpoints must exist
  if (!fromNode || !toNode) {
    return query.connections;
  }

  // The results node has no output
  if (fromNode.type === 'results') {
    return query.connections;
  }

  // Source nodes have no input
  if (toNode.type === 'source') {
    return query.connections;
  }

  // Duplicate connections are ignored
  const duplicate = query.connections.some(
    (connection) => connection.from === from && connection.to === to,
  );

  if (duplicate) {
    return query.connections;
  }

  // Reject connections which would create a cycle
  if (wouldCreateCycle(query.connections, from, to)) {
    return query.connections;
  }

  return [...query.connections, { id: entityId('query-connection'), from, to }];
}

/**
 * Checks whether connecting from → to would create a cycle,
 * i.e. whether from is already reachable from to.
 */
function wouldCreateCycle(
  connections: QueryConnection[],
  from: string,
  to: string,
): boolean {
  // Walk downstream from the connection's target
  const visited = new Set<string>();
  const queue = [to];

  while (queue.length > 0) {
    const nodeId = queue.pop() as string;

    // Reached the connection's origin: a cycle
    if (nodeId === from) {
      return true;
    }

    // Skip already visited nodes
    if (visited.has(nodeId)) {
      continue;
    }

    visited.add(nodeId);

    // Queue the node's downstream neighbours
    connections.forEach((connection) => {
      if (connection.from === nodeId) {
        queue.push(connection.to);
      }
    });
  }

  return false;
}
