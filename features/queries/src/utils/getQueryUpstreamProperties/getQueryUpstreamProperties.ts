import { Databases } from '@minddrop/databases';
import { PropertySchema } from '@minddrop/properties';
import { Queries, Query } from '@minddrop/queries';

/**
 * Returns the property schemas of the entries flowing into a
 * query graph node, including the implicit metadata properties.
 *
 * Returns an empty array when the source node does not flow into
 * the node, or the query has no database.
 *
 * @param query - The query containing the node.
 * @param nodeId - The ID of the node whose upstream properties to get.
 *
 * @returns The upstream property schemas.
 */
export function getQueryUpstreamProperties(
  query: Query,
  nodeId: string,
): PropertySchema[] {
  // No properties unless entries reach the node
  if (!isFedBySource(query, nodeId)) {
    return [];
  }

  const databaseId = Queries.getDatabase(query);
  const database = databaseId ? Databases.get(databaseId, false) : null;

  // No properties without a database
  if (!database) {
    return [];
  }

  return Databases.withImplicitMetadataProperties(database.properties);
}

/**
 * Returns whether the query's source node is upstream of the
 * given node, walking the graph's connections backwards.
 */
function isFedBySource(query: Query, nodeId: string): boolean {
  const visited = new Set<string>();
  const queue = [nodeId];

  while (queue.length > 0) {
    const currentId = queue.shift() as string;

    // Skip already visited nodes
    if (visited.has(currentId)) {
      continue;
    }

    visited.add(currentId);

    // The node's upstream neighbours
    const upstreamIds = query.connections
      .filter((connection) => connection.to === currentId)
      .map((connection) => connection.from);

    const reachesSource = upstreamIds.some(
      (upstreamId) =>
        query.nodes.find((node) => node.id === upstreamId)?.type === 'source',
    );

    if (reachesSource) {
      return true;
    }

    queue.push(...upstreamIds);
  }

  return false;
}
