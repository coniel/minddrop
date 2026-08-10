import { Sql, SqlParam } from '@minddrop/sql';
import { EntryQueryScope, EntrySort } from '../types';
import { buildEntryScopesSql, buildEntrySortSql } from '../utils';

export interface SqlQueryScopedEntriesOptions {
  /**
   * Maximum number of entry IDs to return.
   */
  limit?: number;
}

/**
 * Retrieves the IDs of entries matching any of the given
 * database scopes, ordered by the given sort instructions with
 * title as the final tiebreaker. Results from multiple scopes
 * are sorted together.
 *
 * Async because renderer SQL adapters resolve reads over RPC.
 *
 * @param scopes - The database scopes to match entries against.
 * @param sort - The sort instructions to order results by.
 * @param options - Query options.
 *
 * @returns The matching entry IDs in sorted order.
 */
export async function sqlQueryScopedEntries(
  scopes: EntryQueryScope[],
  sort: EntrySort[],
  options?: SqlQueryScopedEntriesOptions,
): Promise<string[]> {
  // No scopes match no entries
  const scopesSql = buildEntryScopesSql(scopes);

  if (!scopesSql) {
    return [];
  }

  const params: SqlParam[] = [];

  // Build the sort joins and ORDER BY terms
  const sortSql = buildEntrySortSql(sort);

  // Join parameters bind before the WHERE clause parameters
  params.push(...sortSql.params);
  params.push(...scopesSql.params);

  let sql = `SELECT e.id FROM entries e ${sortSql.joins} WHERE ${scopesSql.sql} ORDER BY ${sortSql.orderBy}`;

  // Cap the result count when a limit is given
  if (options?.limit !== undefined) {
    sql = `${sql} LIMIT ?`;
    params.push(options.limit);
  }

  // Await the rows since RPC backed adapters resolve
  // asynchronously despite the synchronous signature
  const rows = await Sql.all<{ id: string }>(sql, ...params);

  return rows.map((row) => row.id);
}
