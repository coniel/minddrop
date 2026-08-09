import { Databases } from '@minddrop/databases';
import { getQuery } from '../getQuery';
import {
  convertQueryRulesToEntryFilter,
  convertQuerySortToEntrySort,
} from '../utils';

/**
 * Runs a query against its source database's SQL data,
 * returning the IDs of matching entries in sorted order.
 *
 * Returns an empty array when the query does not exist, has no
 * source database, or its source database no longer exists.
 *
 * @param queryId - The ID of the query to run.
 *
 * @returns The matching entry IDs.
 */
export async function runQuery(queryId: string): Promise<string[]> {
  const query = getQuery(queryId, false);

  // No results without a query
  if (!query) {
    return [];
  }

  // No results until a source database is selected
  if (!query.database) {
    return [];
  }

  const database = Databases.get(query.database, false);

  // No results if the source database no longer exists
  if (!database) {
    return [];
  }

  // Convert the rule tree and sort to their SQL forms
  const filter = convertQueryRulesToEntryFilter(query.rules, database);
  const sort = convertQuerySortToEntrySort(query.sort, database);

  return Databases.sql.queryEntries(query.database, filter, sort);
}
