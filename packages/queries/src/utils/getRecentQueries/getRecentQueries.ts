import { QueriesStore } from '../../QueriesStore';
import { Query } from '../../types';

/**
 * Returns the most recently created queries, newest first.
 *
 * @param limit - Maximum number of queries to return.
 * @returns The most recently created queries.
 */
export function getRecentQueries(limit: number): Query[] {
  // Sort a copy by creation date, newest first, and cap the result
  // at the limit.
  return [...QueriesStore.getAllArray()]
    .sort(
      (queryA, queryB) => queryB.created.getTime() - queryA.created.getTime(),
    )
    .slice(0, limit);
}
