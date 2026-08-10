import { SqlParam } from '@minddrop/sql';
import { EntryQueryScope } from '../../types';
import { buildEntryFilterSql } from '../buildEntryFilterSql';

export interface EntryScopesSql {
  /**
   * The WHERE condition matching entries in any of the scopes,
   * without the WHERE keyword.
   */
  sql: string;

  /**
   * The positional parameters bound by the condition, in order.
   */
  params: SqlParam[];
}

/**
 * Builds the WHERE condition matching entries in any of the
 * given database scopes: each scope matches its database's
 * entries, narrowed by the scope's filter group when it
 * contains filters.
 *
 * @param scopes - The database scopes to build the condition for.
 *
 * @returns The condition SQL and parameters, or null when no scopes are given.
 */
export function buildEntryScopesSql(
  scopes: EntryQueryScope[],
): EntryScopesSql | null {
  // No scopes match no entries
  if (scopes.length === 0) {
    return null;
  }

  const conditions: string[] = [];
  const params: SqlParam[] = [];

  // Build each scope's database condition
  scopes.forEach((scope) => {
    // Scope the condition to the database
    let condition = 'e.database_id = ?';

    params.push(scope.databaseId);

    // Append the filter conditions when the scope's filter tree
    // contains any filters
    const filterSql = scope.filter ? buildEntryFilterSql(scope.filter) : null;

    if (filterSql) {
      condition = `${condition} AND ${filterSql.sql}`;
      params.push(...filterSql.params);
    }

    conditions.push(`(${condition})`);
  });

  // A single scope needs no OR wrapping
  if (conditions.length === 1) {
    return { sql: conditions[0], params };
  }

  return { sql: `(${conditions.join(' OR ')})`, params };
}
