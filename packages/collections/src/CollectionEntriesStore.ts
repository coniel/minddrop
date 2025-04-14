import { createArrayStore } from '@minddrop/utils';
import { CollectionEntry } from './types';

export const CollectionEntriesStore = createArrayStore<CollectionEntry>('path');

/**
 * Adds a collection entry to the store.
 *
 * @param entry - The collection entry to add.
 */
export const addCollectionEntry = (entry: CollectionEntry): void =>
  CollectionEntriesStore.add(entry);

/**
 * Removes a collection entry from the store.
 *
 * @param path - The collection entry's path.
 */
export const removeCollectionEntry = (path: string): void =>
  CollectionEntriesStore.remove(path);

/**
 * Updates a collection in the store.
 *
 * @param path - The collection entry's path.
 * @param data - The new properties to set on the entry.
 */
export const updateCollectionEntry = (
  path: string,
  data: Partial<CollectionEntry>,
): void => CollectionEntriesStore.update(path, data);

/**
 * Retrieves a collection entry by path or null if it doesn't exist.
 *
 * @param path - The collection entry's path.
 * @returns The collection entry or null if it doesn't exist.
 */
export const getCollectionEntry = (path: string): CollectionEntry | null =>
  CollectionEntriesStore.get(path);

/**
 * Retrieves all entries for a given collection.
 *
 * @param collectionPath - The collection's path.
 * @returns An array of all entries for a given collection.
 */
export const getCollectionEntries = (
  collectionPath: string,
): CollectionEntry[] =>
  CollectionEntriesStore.getAll().filter((entry) =>
    entry.path.startsWith(collectionPath),
  );

/**
 * Retrieves all collection entries.
 *
 * @returns An array of all collection entries.
 */
export const getAllCollectionEntries = (): CollectionEntry[] =>
  CollectionEntriesStore.getAll();

/**
 * Loads collection entries into the store.
 *
 * @param entries - The collection entries to load.
 */
export const loadCollectionEntries = (entries: CollectionEntry[]): void =>
  CollectionEntriesStore.load(entries);

/**
 * Retrieves a collection entry by path or null if it doesn't exist.
 *
 * @param path - The collection entry's path.
 * @returns The collection entry or null if it doesn't exist.
 */
export const useCollectionEntry = (
  collectionPath: string,
  entryPath: string,
): CollectionEntry | null => {
  return (
    CollectionEntriesStore.useAllItems().find(
      (entry) =>
        entry.collectionPath === collectionPath && entry.path === entryPath,
    ) || null
  );
};

/**
 * Retrieves all entries for a given collecton.
 *
 * @param collectionPath - The collection's path.
 * @returns And array of all entries for a given collection.
 */
export const useCollectionEntries = (
  collectionPath: string,
): CollectionEntry[] => {
  return CollectionEntriesStore.useAllItems().filter(
    (entry) => entry.collectionPath === collectionPath,
  );
};
