import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { removeCollectionEntry } from '../CollectionEntriesStore';
import { getCollectionEntry } from '../getCollectionEntry';
import { getEntryPropertiesFilePath } from '../utils';

/**
 * Deletes a collection entry and all of its associated files.
 *
 * @param collectionPath - The path to the collection.
 * @param entryPath - The path to the entry.
 *
 * @throws {CollectionNotFoundError} If the collection does not exist.
 * @throws {CollectionTypeNotRegisteredError} If the collection type config is not registered.
 * @throws {CollectionEntryNotFoundError} If the entry does not exist.
 *
 * @dispatches collections:entry:delete
 */
export async function deleteCollectionEntry(entryPath: string): Promise<void> {
  // Get the entry
  const entry = getCollectionEntry(entryPath, true);

  // Remove the entry from the store
  removeCollectionEntry(entryPath);

  // Delete the entry file
  await Fs.removeFile(entry.path);

  // Delete the entry properties file if it exists
  const propertiesFilePath = getEntryPropertiesFilePath(entry);

  if (await Fs.exists(propertiesFilePath)) {
    await Fs.removeFile(propertiesFilePath);
  }

  // Dispatch the entry delete event
  Events.dispatch('collections:entry:delete', entry);
}
