import { getQuery } from '../../getQuery';
import { Query, QuerySourceReference } from '../../types';
import { getQuerySourceNode } from '../getQuerySourceNode';

/**
 * Returns the IDs of the queries a query draws results from,
 * following each sourced query's own source, nearest first.
 *
 * A missing query is included, so its creation can be listened
 * for. The chain stops where it loops back on itself.
 *
 * @param query - The query whose references to get.
 *
 * @returns The referenced query IDs.
 */
export function getQueryReferencedQueryIds(query: Query): string[] {
  const queryIds: string[] = [];

  // The queries already on the source chain
  const visited = new Set<string>([query.id]);
  let current: Query | null = query;

  // Follow query sources until one names a database
  while (current) {
    const source: QuerySourceReference | undefined =
      getQuerySourceNode(current)?.source;

    // The chain ends at a database or an unpicked source
    if (source?.type !== 'query' || !source.id) {
      break;
    }

    // Stop at queries already on the chain
    if (visited.has(source.id)) {
      break;
    }

    visited.add(source.id);
    queryIds.push(source.id);

    current = getQuery(source.id, false);
  }

  return queryIds;
}
