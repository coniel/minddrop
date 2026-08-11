import { getQuery } from '../../getQuery';
import { Query } from '../../types';

/**
 * Returns the IDs of the queries a query's graph draws results
 * from, following those queries' own sources.
 *
 * @param query - The query whose references to get.
 *
 * @returns The referenced query IDs.
 */
export function getQueryReferencedQueryIds(query: Query): string[] {
  return Array.from(collectQueryIds(query, new Set([query.id])));
}

/**
 * Collects the query IDs referenced by a query's source nodes,
 * recursing into each referenced query.
 */
function collectQueryIds(query: Query, visited: Set<string>): Set<string> {
  const queryIds = new Set<string>();

  query.nodes.forEach((node) => {
    if (node.type !== 'source') {
      return;
    }

    node.sources.forEach((source) => {
      if (source.type !== 'query' || !source.id) {
        return;
      }

      // Stop at queries already on the reference path
      if (visited.has(source.id)) {
        return;
      }

      queryIds.add(source.id);

      const referenced = getQuery(source.id, false);

      // A missing query is still worth listening to, in case it
      // is created later
      if (!referenced) {
        return;
      }

      // Collect the references of the referenced query
      collectQueryIds(referenced, new Set([...visited, source.id])).forEach(
        (queryId) => queryIds.add(queryId),
      );
    });
  });

  return queryIds;
}
