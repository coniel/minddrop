import { useCallback } from 'react';
import { runQuery } from '../runQuery';
import { useQueryRunner } from '../useQueryRunner';

/**
 * Returns the IDs of entries matching a query, re-running the
 * query whenever the query changes or one of its source
 * databases' SQL data syncs.
 *
 * Returns an empty array when the query does not exist or no
 * source is connected to its results node.
 *
 * @param queryId - The ID of the query to run.
 *
 * @returns The matching entry IDs.
 */
export function useQueryResults(queryId: string): string[] {
  // Runs the query against the latest SQL data
  const runResults = useCallback(() => runQuery(queryId), [queryId]);

  // Re-run whenever the query or the data it draws from changes
  return useQueryRunner(queryId, EMPTY_RESULTS, runResults);
}

// Stable empty value returned while the query does not exist
const EMPTY_RESULTS: string[] = [];
