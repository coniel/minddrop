import { QueriesStore } from '../QueriesStore';
import { QueryNotFoundError } from '../errors';
import { Query } from '../types';

/**
 * Retrieves a query from the store by ID.
 *
 * @param id - The ID of the query.
 * @param throwOnNotFound - Whether to throw an error if the query is not found.
 * @returns The query object.
 *
 * @throws {QueryNotFoundError} If the query does not exist.
 */
export function getQuery(id: string): Query;
export function getQuery(id: string, throwOnNotFound: false): Query | null;
export function getQuery(id: string, throwOnNotFound = true): Query | null {
  // Get the query from the store
  const query = QueriesStore.get(id);

  // Throw an error if it doesn't exist, unless specified not to
  if (!query && throwOnNotFound) {
    throw new QueryNotFoundError(id);
  } else if (!query && !throwOnNotFound) {
    return null;
  }

  return query;
}
