import { createArrayStore } from '@minddrop/utils';
import { Database } from './types';

export const DatabasesStore = createArrayStore<Database>('id');

/**
 * Retrieves a Database by ID or null if it doesn't exist.
 *
 * @param id - The ID of the database to retrieve.
 * @returns The database or null if it doesn't exist.
 */
export const useDatabase = (id: string): Database | null => {
  return (
    DatabasesStore.useAllItems().find((database) => database.id === id) || null
  );
};

/**
 * Retrieves all databases.
 *
 * @returns And array of all databases.
 */
export const useDatabases = (): Database[] => {
  return DatabasesStore.useAllItems();
};
