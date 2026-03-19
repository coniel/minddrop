import { createObjectStore } from '@minddrop/stores';
import { Query } from './types';

export const QueriesStore = createObjectStore<Query>('Queries:Queries', 'id');

/**
 * Retrieves a Query by ID or null if it doesn't exist.
 *
 * @param id - The ID of the query to retrieve.
 * @returns The query or null if it doesn't exist.
 */
export const useQuery = (id: string): Query | null => {
  return QueriesStore.useItem(id);
};

/**
 * Retrieves all queries.
 *
 * @returns An array of all queries.
 */
export const useQueries = (): Query[] => {
  return QueriesStore.useAllItemsArray();
};
