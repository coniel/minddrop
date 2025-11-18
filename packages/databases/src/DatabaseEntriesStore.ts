import { createArrayStore } from '@minddrop/utils';
import { DatabaseEntry } from './types';

export const DatabaseEntriesStore = createArrayStore<DatabaseEntry>('id');

/**
 * Retrieves an entry by ID or null if it doesn't exist.
 *
 * @param id - The ID of the entry to retrieve.
 * @returns The entry or null if it doesn't exist.
 */
export const useDatabaseEntry = (id: string): DatabaseEntry | null => {
  return (
    DatabaseEntriesStore.useAllItems().find((config) => config.id === id) ||
    null
  );
};

/**
 * Retrieves all entries.
 *
 * @returns And array of all entries.
 */
export const useDatabaseEntries = (): DatabaseEntry[] => {
  return DatabaseEntriesStore.useAllItems();
};
