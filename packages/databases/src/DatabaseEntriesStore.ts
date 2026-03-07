import { shallow } from 'zustand/shallow';
import { createObjectStore } from '@minddrop/stores';
import { DatabaseEntry } from './types';

export const DatabaseEntriesStore = createObjectStore<DatabaseEntry>(
  'Databases:Entries',
  'id',
);

/**
 * Retrieves an entry by ID or null if it doesn't exist.
 *
 * @param id - The ID of the entry to retrieve.
 * @returns The entry or null if it doesn't exist.
 */
export const useDatabaseEntry = (entryId: string): DatabaseEntry | null =>
  DatabaseEntriesStore.useItem(entryId);

/**
 * Retrieves all entries for a given database.
 *
 * @returns An array of all entries.
 */
export const useDatabaseEntries = (databaseId: string): DatabaseEntry[] =>
  DatabaseEntriesStore.useStore(
    (state) =>
      Object.values(state.items).filter(
        (entry) => entry.database === databaseId,
      ),
    shallow,
  );

/**
 * Retrieves the IDs of all entries for a given database.
 *
 * @returns An array of all entry IDs.
 */
export const useDatabaseEntryIds = (databaseId: string): string[] => {
  return DatabaseEntriesStore.useStore(
    (state) =>
      Object.values(state.items)
        .filter((entry) => entry.database === databaseId)
        .map((entry) => entry.id),
    shallow,
  );
};
