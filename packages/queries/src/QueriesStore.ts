import { createArrayStore } from '@minddrop/utils';
import { Query } from './types';

export const QueriesStore = createArrayStore<Query>('id');

/**
 * Retrieves a Query by ID or null if it doesn't exist.
 *
 * @param id - The ID of the query to retrieve.
 * @returns The query or null if it doesn't exist.
 */
export const useQuery = (id: string): Query | null => {
  return QueriesStore.useAllItems().find((query) => query.id === id) || null;
};

/**
 * Retrieves all queries.
 *
 * @returns And array of all queries.
 */
export const useQueries = (): Query[] => {
  return QueriesStore.useAllItems();
};
