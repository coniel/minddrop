import { useCallback } from 'react';
import { QueryNodeCounts, getQueryNodeCounts } from '../getQueryNodeCounts';
import { useQueryRunner } from '../useQueryRunner';

/**
 * Returns the entry counts flowing into and out of each node of
 * a query's graph, re-counting whenever the query changes or
 * one of its source databases' SQL data syncs.
 *
 * Returns an empty record when the query does not exist.
 *
 * @param queryId - The ID of the query whose node counts to get.
 *
 * @returns The input/output counts keyed by node ID.
 */
export function useQueryNodeCounts(
  queryId: string,
): Record<string, QueryNodeCounts> {
  // Counts the node flows against the latest SQL data
  const runCounts = useCallback(() => getQueryNodeCounts(queryId), [queryId]);

  // Re-count whenever the query or the data it draws from changes
  return useQueryRunner(queryId, EMPTY_COUNTS, runCounts);
}

// Stable empty value returned while the query does not exist
const EMPTY_COUNTS: Record<string, QueryNodeCounts> = {};
