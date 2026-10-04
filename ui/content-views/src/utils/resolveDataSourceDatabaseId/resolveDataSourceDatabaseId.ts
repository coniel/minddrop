import { ViewDataSource } from '@minddrop/content-views';
import { Queries } from '@minddrop/queries';

/**
 * Resolves the single database a view data source draws from.
 *
 * @param dataSource - The view data source.
 * @returns The database ID, or null when the source has no single database.
 */
export function resolveDataSourceDatabaseId(
  dataSource: ViewDataSource,
): string | null {
  // Return a database source's database
  if (dataSource.type === 'database') {
    return dataSource.id;
  }

  // Check if the source is a query. If not, it is a collection and
  // has no database.
  if (dataSource.type !== 'query') {
    return null;
  }

  // Get the source query
  const query = Queries.get(dataSource.id, false);

  if (!query) {
    return null;
  }

  // Return the database the query draws from
  return Queries.getDatabase(query);
}
