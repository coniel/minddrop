import { useCallback } from 'react';
import { runQueryNode } from '../runQueryNode';
import { useQueryRunner } from '../useQueryRunner';

/**
 * Returns the IDs of the entries flowing out of a query node,
 * re-running the node whenever the query changes or one of its
 * source databases' SQL data syncs.
 *
 * Returns an empty array when the query or node does not exist
 * or no source flows into the node.
 *
 * @param queryId - The ID of the query containing the node.
 * @param nodeId - The ID of the node whose output to get.
 *
 * @returns The entry IDs flowing out of the node.
 */
export function useQueryNodeResults(queryId: string, nodeId: string): string[] {
  // Runs the node against the latest SQL data
  const runNode = useCallback(
    () => runQueryNode(queryId, nodeId),
    [queryId, nodeId],
  );

  // Re-run whenever the query or the data it draws from changes
  return useQueryRunner(queryId, EMPTY_RESULTS, runNode);
}

// Stable empty value returned while the query does not exist
const EMPTY_RESULTS: string[] = [];
