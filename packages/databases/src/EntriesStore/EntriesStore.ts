import { shallow } from 'zustand/shallow';
import { createObjectStore } from '@minddrop/stores';
import { Entry, EntryPropertyMetadata } from '../types';

export const EntriesStore = createObjectStore<Entry>(
  'Databases:Entries',
  'id',
  { scope: 'workspace' },
);

/**
 * Retrieves an entry by ID or null if it doesn't exist.
 *
 * @param entryId - The ID of the entry to retrieve.
 * @returns The entry or null if it doesn't exist.
 */
export const useEntry = (entryId: string): Entry | null =>
  EntriesStore.useItem(entryId);

// The metadata of a property without any. Shared so that the hook
// returns a stable value.
const EmptyPropertyMetadata: EntryPropertyMetadata = {};

/**
 * Retrieves the metadata of an entry's property. Empty when the
 * property has none or the entry does not exist. The metadata is
 * typed as the caller declares it.
 *
 * @param entryId - The ID of the entry.
 * @param property - The name of the property.
 * @returns The property's metadata.
 */
export const useEntryPropertyMetadata = <
  TMetadata extends EntryPropertyMetadata = EntryPropertyMetadata,
>(
  entryId: string,
  property: string,
): TMetadata =>
  EntriesStore.useStore(
    (state) =>
      (state.items[entryId]?.metadata.properties?.[property] ??
        EmptyPropertyMetadata) as TMetadata,
  );

/**
 * Retrieves all entries for a given database, or across all
 * databases when no database ID is given.
 *
 * @param databaseId - The ID of the database to filter by.
 * @returns An array of all entries.
 */
export const useEntries = (databaseId?: string): Entry[] =>
  EntriesStore.useStore(
    (state) =>
      Object.values(state.items).filter(
        (entry) => !databaseId || entry.database === databaseId,
      ),
    shallow,
  );

/**
 * Retrieves the entries matching the given IDs, omitting IDs
 * which do not match an entry.
 *
 * @param entryIds - The IDs of the entries to retrieve.
 * @returns An array of the matching entries.
 */
export const useEntriesByIds = (entryIds: string[]): Entry[] =>
  EntriesStore.useItemsArray(entryIds);

/**
 * Retrieves the IDs of all entries for a given database.
 *
 * @returns An array of all entry IDs.
 */
export const useEntryIds = (databaseId: string): string[] => {
  return EntriesStore.useStore(
    (state) =>
      Object.values(state.items)
        .filter((entry) => entry.database === databaseId)
        .map((entry) => entry.id),
    shallow,
  );
};
