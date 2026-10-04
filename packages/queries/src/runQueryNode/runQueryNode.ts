import { Databases } from '@minddrop/databases';
import { getQuery } from '../getQuery';
import { resolveQuerySourceResults } from '../resolveQuerySourceResults';
import { compileQueryGraph } from '../utils';

/**
 * Runs a query's node graph against the SQL data, returning
 * the IDs of the entries flowing out of the given node in
 * sorted order.
 *
 * Returns an empty array when the query or node does not exist
 * or no source flows into the node.
 *
 * @param queryId - The ID of the query containing the node.
 * @param nodeId - The ID of the node whose output to run.
 *
 * @returns The entry IDs flowing out of the node.
 */
export async function runQueryNode(
  queryId: string,
  nodeId: string,
): Promise<string[]> {
  const query = getQuery(queryId, false);

  // No results without a query
  if (!query) {
    return [];
  }

  // Run the query the source node draws from, if any
  const sourceResults = await resolveQuerySourceResults(query);

  // Compile the graph and read the node's output scope
  const compiled = compileQueryGraph(query, sourceResults)[nodeId];

  // No results without the node or a source flowing into it
  if (!compiled?.outputScope) {
    return [];
  }

  return Databases.sql.queryScopedEntries(
    [compiled.outputScope],
    compiled.sorts,
    compiled.limit !== null ? { limit: compiled.limit } : undefined,
  );
}
