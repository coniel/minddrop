import { getQuery } from '../../getQuery';
import { Query } from '../../types';

/**
 * Returns the IDs of the databases feeding a query's graph,
 * resolving sources drawing from another query to that query's
 * databases.
 *
 * Queries caught in a reference cycle contribute the databases
 * reached before the cycle closes.
 *
 * @param query - The query whose databases to get.
 *
 * @returns The database IDs.
 */
export function getQueryDatabases(query: Query): string[] {
  return Array.from(collectDatabases(query, new Set([query.id])));
}

/**
 * Collects a query's database IDs, following query sources into
 * the queries they draw from.
 */
function collectDatabases(query: Query, visited: Set<string>): Set<string> {
  const databaseIds = new Set<string>();

  query.nodes.forEach((node) => {
    if (node.type !== 'source') {
      return;
    }

    node.sources.forEach((source) => {
      if (!source.id) {
        return;
      }

      // Database sources name their database directly
      if (source.type === 'database') {
        databaseIds.add(source.id);

        return;
      }

      // Stop at queries already on the reference path
      if (visited.has(source.id)) {
        return;
      }

      const referenced = getQuery(source.id, false);

      if (!referenced) {
        return;
      }

      // Collect the referenced query's own databases
      collectDatabases(referenced, new Set([...visited, source.id])).forEach(
        (databaseId) => databaseIds.add(databaseId),
      );
    });
  });

  return databaseIds;
}
