import { Events } from '@minddrop/events';
import { Fs, PathConflictError } from '@minddrop/file-system';
import { CollectionEntriesStore } from '../CollectionEntriesStore';
import { getCollection } from '../getCollection';
import { getCollectionEntry } from '../getCollectionEntry';
import { getCollectionTypeConfig } from '../getCollectionTypeConfig';
import { CollectionEntry } from '../types';
import { getEntryPropertiesFilePath } from '../utils';
import { writeCollectionEntryProperties } from '../writeCollectionEntryProperties';
import { writeTextCollectionEntry } from '../writeTextCollectionEntry';

/**
 * Renames a collection entry and associated files, returning the updated entry
 * with the new title and its new path.
 *
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
  entryPath: string,
  newTitle: string,
): Promise<CollectionEntry> {
  // Get the entry
  const entry = getCollectionEntry(entryPath, true);
  // Get the collection
  const collection = getCollection(entry.collectionPath, true);
  // Get the collection type config
  const config = getCollectionTypeConfig(collection.type);
  // Get the file extension of the entry file
  const entryFileExtension = entry.path.split('.').pop();
  // Generate the new entry path
  const newEntryPath = `${entry.collectionPath}/${newTitle}.${entryFileExtension}`;

  // Ensure no other file exists at the new path
  if (await Fs.exists(newEntryPath)) {
    throw new PathConflictError(newEntryPath);
  }

  // Update the path, title, and lastModified timestamp on the entry
  const updatedEntry = {
    ...entry,
    path: newEntryPath,
    properties: {
      ...entry.properties,
      title: newTitle,
      lastModified: new Date(),
    },
  };

  // Update the entry in the store
  CollectionEntriesStore.update(entryPath, updatedEntry);

  // Rename the entry file
  await Fs.rename(entry.path, updatedEntry.path);

  // Rename the entry's properties file if it exists
  const entryPropertiesFilePath = getEntryPropertiesFilePath(entry);

  if (await Fs.exists(entryPropertiesFilePath)) {
    const updatedEntryPropertiesFilePath =
      getEntryPropertiesFilePath(updatedEntry);

    await Fs.rename(entryPropertiesFilePath, updatedEntryPropertiesFilePath);
  }

  // If the collection is text based, rewrite the entry files
  if (config.type === 'text') {
    writeTextCollectionEntry(updatedEntry);
  }

  // If the collection is file based, update the entry properties file
  if (config.type === 'file') {
    writeCollectionEntryProperties(
      collection.path,
      newTitle,
      updatedEntry.properties,
    );
  }

  // Dispatch a entry rename event
  Events.dispatch('collections:entry:rename', updatedEntry);

  // Return the updated entry
  return updatedEntry;
}
