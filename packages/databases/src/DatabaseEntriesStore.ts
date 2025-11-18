import { createArrayStore } from '@minddrop/utils';
import { DatabaseEntry } from './types';

export const DatabaseEntriesStore = createArrayStore<DatabaseEntry>('path');

/**
 * Retrieves an entry by path or null if it doesn't exist.
 *
 * @param path - The path of the entry to retrieve.
 * @returns The entry or null if it doesn't exist.
 */
export const useDatabaseEntry = (path: string): DatabaseEntry | null => {
  return (
    DatabaseEntriesStore.useAllItems().find((config) => config.path === path) ||
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
