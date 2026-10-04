import { getQuery } from '../../getQuery';
import { Query, QuerySourceReference } from '../../types';
import { getQuerySourceNode } from '../getQuerySourceNode';

/**
 * Returns the ID of the database a query draws its entries from,
 * resolving a source drawing from another query to that query's
 * database.
 *
 * Returns null when no source is picked, when the source chain
 * reaches a missing query, or when it loops back on itself.
 *
 * @param query - The query whose database to get.
 *
 * @returns The database ID, or null.
 */
export function getQueryDatabase(query: Query): string | null {
  // The queries already on the source chain
  const visited = new Set<string>();
  let current: Query | null = query;

  // Follow query sources until one names a database
  while (current && !visited.has(current.id)) {
    visited.add(current.id);

    const source: QuerySourceReference | undefined =
      getQuerySourceNode(current)?.source;

    // No database without a picked source
    if (!source?.id) {
      return null;
    }

    // Database sources name their database directly
    if (source.type === 'database') {
      return source.id;
    }

    current = getQuery(source.id, false);
  }

  return null;
}
