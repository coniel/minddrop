import { Sql, SqlParam } from '@minddrop/sql';
import { EntryFilterGroup, EntrySort } from '../types';
import { buildEntryFilterSql, buildEntrySortSql } from '../utils';

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
  const params: SqlParam[] = [];

  // Build the sort joins and ORDER BY terms
  const sortSql = buildEntrySortSql(sort);

  // Join parameters bind before the WHERE clause parameters
  params.push(...sortSql.params);

  // Scope the query to the database
  let where = 'e.database_id = ?';

  params.push(databaseId);

  // Append the filter conditions when the filter tree contains
  // any filters
  const filterSql = filter ? buildEntryFilterSql(filter) : null;

  if (filterSql) {
    where = `${where} AND ${filterSql.sql}`;
    params.push(...filterSql.params);
  }

  let sql = `SELECT e.id FROM entries e ${sortSql.joins} WHERE ${where} ORDER BY ${sortSql.orderBy}`;

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
