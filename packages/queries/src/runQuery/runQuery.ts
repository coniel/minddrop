import { Databases } from '@minddrop/databases';
import { getQuery } from '../getQuery';
import { compileQueryGraph } from '../utils';

/**
 * Runs a query's node graph against the SQL data, returning
 * the IDs of the entries reaching the results node in sorted
 * order.
 *
 * Returns an empty array when the query does not exist or no
 * source is connected to the results node.
 *
 * @param queryId - The ID of the query to run.
 *
 * @returns The matching entry IDs.
 */
export async function runQuery(queryId: string): Promise<string[]> {
  const query = getQuery(queryId, false);

  // No results without a query
  if (!query) {
    return [];
  }

  const resultsNode = query.nodes.find((node) => node.type === 'results');

  // No results without a results node
  if (!resultsNode) {
    return [];
  }

  // Compile the graph and read the scopes reaching the results
  // node
  const compiled = compileQueryGraph(query)[resultsNode.id];

  return Databases.sql.queryScopedEntries(
    compiled.outputScopes,
    compiled.sorts,
    compiled.limit !== null ? { limit: compiled.limit } : undefined,
  );
}
