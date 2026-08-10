import { Sql } from '@minddrop/sql';
import { EntryQueryScope } from '../types';
import { buildEntryScopesSql } from '../utils';

/**
 * Counts the entries matching any of the given database scopes.
 *
 * Async because renderer SQL adapters resolve reads over RPC.
 *
 * @param scopes - The database scopes to match entries against.
 *
 * @returns The number of matching entries.
 */
export async function sqlCountScopedEntries(
  scopes: EntryQueryScope[],
): Promise<number> {
  // No scopes match no entries
  const scopesSql = buildEntryScopesSql(scopes);

  if (!scopesSql) {
    return 0;
  }

  // Await the row since RPC backed adapters resolve
  // asynchronously despite the synchronous signature
  const rows = await Sql.all<{ count: number }>(
    `SELECT COUNT(*) AS count FROM entries e WHERE ${scopesSql.sql}`,
    ...scopesSql.params,
  );

  return rows[0]?.count ?? 0;
}
