import { Query } from '@minddrop/queries';
import { getQueryMismatchedSourceDatabases } from '../getQueryMismatchedSourceDatabases';
import { getQueryUpstreamDatabases } from '../getQueryUpstreamDatabases';

/**
 * Returns the IDs of the connections making up the mismatched
 * trails of a query graph: for each filter or sort node fed by
 * sources whose entries lack its configured property, the
 * connections delivering those sources' entries into the node,
 * all the way up from the sources.
 *
 * Connections delivering only matching databases are not part
 * of a trail, so a merge of a matching and a mismatched branch
 * flags only the mismatched branch.
 *
 * @param query - The query whose connections to check.
 *
 * @returns The mismatched connection IDs.
 */
export function getQueryMismatchedConnectionIds(query: Query): Set<string> {
  const mismatched = new Set<string>();

  // Trace each node's mismatched sources back through the
  // graph
  query.nodes.forEach((node) => {
    // The databases feeding the node which lack its property
    const invalidDatabaseIds = new Set(
      getQueryMismatchedSourceDatabases(query, node.id).map(
        (database) => database.id,
      ),
    );

    // All inputs deliver usable entries
    if (invalidDatabaseIds.size === 0) {
      return;
    }

    // Walk upstream from the node, flagging connections
    // delivering any of the mismatched databases
    const visited = new Set<string>();
    const queue = [node.id];

    while (queue.length > 0) {
      const currentId = queue.pop() as string;

      // Skip already visited nodes
      if (visited.has(currentId)) {
        continue;
      }

      visited.add(currentId);

      query.connections.forEach((connection) => {
        // Only the current node's inputs extend the trail
        if (connection.to !== currentId) {
          return;
        }

        // The databases delivered by this connection
        const carried = getQueryUpstreamDatabases(query, connection.from);

        // Connections delivering none of the mismatched
        // databases are not part of the trail
        if (!carried.some((database) => invalidDatabaseIds.has(database.id))) {
          return;
        }

        mismatched.add(connection.id);
        queue.push(connection.from);
      });
    }
  });

  return mismatched;
}
