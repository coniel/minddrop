import { EntryFilterGroup, EntrySort } from '../types';
import { sqlQueryScopedEntries } from './sqlQueryScopedEntries';

export interface SqlQueryEntriesOptions {
  /**
   * Maximum number of entry IDs to return.
   */
  limit?: number;
}

/**
 * Retrieves the IDs of a database's entries matching a filter
 * group, ordered by the given sort instructions with title as
 * the final tiebreaker.
 *
 * Async because renderer SQL adapters resolve reads over RPC.
 *
 * @param databaseId - The ID of the database to query.
 * @param filter - The filter group to match entries against, or null to match all entries.
 * @param sort - The sort instructions to order results by.
 * @param options - Query options.
 *
 * @returns The matching entry IDs in sorted order.
 */
export async function sqlQueryEntries(
  databaseId: string,
  filter: EntryFilterGroup | null,
  sort: EntrySort[],
  options?: SqlQueryEntriesOptions,
): Promise<string[]> {
  // A single-database query is a scoped query with one scope
  return sqlQueryScopedEntries([{ databaseId, filter }], sort, options);
}
