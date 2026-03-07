import { createObjectStore } from '@minddrop/stores';
import { Database } from './types';

export const DatabasesStore = createObjectStore<Database>(
  'Databases:Databases',
  'id',
);

/**
 * Retrieves a Database by ID or null if it doesn't exist.
 *
 * @param id - The ID of the database to retrieve.
 * @returns The database or null if it doesn't exist.
 */
export const useDatabase = (id: string): Database | null => {
  return DatabasesStore.useItem(id);
};

/**
 * Retrieves all databases.
 *
 * @returns An array of all databases.
 */
export const useDatabases = (): Database[] => {
  return DatabasesStore.useAllItemsArray();
};
