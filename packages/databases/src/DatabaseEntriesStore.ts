import { createArrayStore, useShallow } from '@minddrop/utils';
import { DatabaseEntry } from './types';

export const DatabaseEntriesStore = createArrayStore<DatabaseEntry>('id');

/**
 * Retrieves an entry by ID or null if it doesn't exist.
 *
 * @param id - The ID of the entry to retrieve.
 * @returns The entry or null if it doesn't exist.
 */
export const useDatabaseEntry = (entryId: string): DatabaseEntry | null =>
  DatabaseEntriesStore.useStore(
    (state) => state.items.find((item) => item.id === entryId) || null,
  );

/**
 * Retrieves all entries for a given database.
 *
 * @returns And array of all entries.
 */
export const useDatabaseEntries = (databaseId: string): DatabaseEntry[] =>
  DatabaseEntriesStore.useStore((state) =>
    state.items.filter((entry) => entry.database === databaseId),
  );

/**
 * Retrieves the IDs of all entries for a given database.
 *
 * @returns And array of all entry IDs.
 */
export const useDatabaseEntryIds = (databaseId: string): string[] => {
  return DatabaseEntriesStore.useStore(
    useShallow((state) =>
      state.items
        .filter((entry) => entry.database === databaseId)
        .map((entry) => entry.id),
    ),
  );
};
