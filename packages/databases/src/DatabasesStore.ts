import { createArrayStore } from '@minddrop/utils';
import { Database } from './types';

export const DatabasesStore = createArrayStore<Database>('name');

/**
 * Retrieves a Database by type or null if it doesn't exist.
 *
 * @param name - The name of the database to retrieve.
 * @returns The database or null if it doesn't exist.
 */
export const useDatabase = (name: string): Database | null => {
  return (
    DatabasesStore.useAllItems().find((config) => config.name === name) || null
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
