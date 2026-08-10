import { Database, Databases } from '@minddrop/databases';
import { Query } from '@minddrop/queries';

/**
 * Returns the databases emitted by the source nodes upstream of
 * a query graph node, in the order they are encountered walking
 * up the graph. Sources referencing missing databases are
 * skipped.
 *
 * @param query - The query containing the node.
 * @param nodeId - The ID of the node whose upstream databases to get.
 *
 * @returns The upstream source databases.
 */
export function getQueryUpstreamDatabases(
  query: Query,
  nodeId: string,
): Database[] {
  const databaseIds: string[] = [];
  const visited = new Set<string>();
  const queue = [nodeId];

  // Walk the graph upstream from the node
  while (queue.length > 0) {
    const currentId = queue.shift() as string;

    // Skip already visited nodes
    if (visited.has(currentId)) {
      continue;
    }

    visited.add(currentId);

    // Collect source node databases
    const node = query.nodes.find((queryNode) => queryNode.id === currentId);

    if (node?.type === 'source' && node.database) {
      if (!databaseIds.includes(node.database)) {
        databaseIds.push(node.database);
      }

      continue;
    }

    // Queue the node's upstream neighbours
    query.connections.forEach((connection) => {
      if (connection.to === currentId) {
        queue.push(connection.from);
      }
    });
  }

  // Resolve the collected IDs, dropping missing databases
  return databaseIds.flatMap((databaseId) => {
    const database = Databases.get(databaseId, false);

    return database ? [database] : [];
  });
}
