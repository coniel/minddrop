import { Events } from '@minddrop/events';
import { CollectionEntriesStore } from '../CollectionEntriesStore';
import { getCollection } from '../getCollection';
import { getCollectionEntry } from '../getCollectionEntry';
import { getCollectionTypeConfig } from '../getCollectionTypeConfig';
import { CollectionEntry } from '../types';

/**
 * Renames a collection entry, returning the updated entry with the new title
 * and its new path.
 *
 * @param collectionPath - The path to the collection.
 * @param entryPath - The path to the entry.
 * @param newTitle - The new title of the entry.
 * @returns The updated collection entry.
 *
 * @throws {CollectionNotFoundError} If the collection does not exist.
 * @throws {CollectionEntryNotFoundError} If the entry does not exist.
 * @throws {CollectionTypeNotRegisteredError} If the collection type config is not registered.
 *
 * @dispatches collections:entry:rename
 */
export async function renameCollectionEntry(
  collectionPath: string,
  entryPath: string,
  newTitle: string,
): Promise<CollectionEntry> {
  // Get the collection
  const collection = getCollection(collectionPath, true);
  // Get the collection type config
  const config = getCollectionTypeConfig(collection.type);
  // Get the entry
  const entry = getCollectionEntry(entryPath, true);

  // Update the lastModified timestamp in metadata
  const metadata = {
    ...entry.metadata,
    lastModified: new Date(),
  };

  // Call the renameEntry method from the collection type config.
  // This method should handle the renaming of the entry's file(s) on
  // the file system and return the updated entry including its new path.
  const updatedEntry = await config.renameEntry(entry, newTitle, metadata);

  // Update the entry in the store
  CollectionEntriesStore.update(entryPath, updatedEntry);

  // Dispatch a entry rename event
  Events.dispatch('collections:entry:rename', updatedEntry);

  // Return the updated entry
  return updatedEntry;
}
