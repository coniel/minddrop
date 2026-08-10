import { getQuery } from '../getQuery';
import { runQueryNode } from '../runQueryNode';

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

  // Run the graph up to the results node
  return runQueryNode(queryId, resultsNode.id);
}
