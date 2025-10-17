import { Events } from '@minddrop/events';
import { InvalidParameterError } from '@minddrop/utils';
import { updateCollectionEntry as updateInStore } from '../CollectionEntriesStore';
import { getCollection } from '../getCollection';
import { getCollectionEntry } from '../getCollectionEntry';
import { getCollectionTypeConfig } from '../getCollectionTypeConfig';
import { CollectionEntry, CollectionEntryProperties } from '../types';
import { writeCollectionEntryProperties } from '../writeCollectionEntryProperties';
import { writeTextCollectionEntry } from '../writeTextCollectionEntry';

/**
 * Updates a collection entry and writes the updates to the file system.
 *
 * @param entryPath - The path of the entry.
 * @param updates - The property updates to apply to the entry.
 * @returns The updated collection entry.
 *
 * @throws {CollectionNotFoundError} If the collection does not exist.
 * @throws {CollectionTypeConfigNotFoundError} If the collection type config does not exist.
 * @throws {CollectionEntryNotFoundError} If the entry does not exist.
 * @throws {InvalidParameterError} If the updates contain a title property.
 *
 * @dispatches collections:entry:update
 */
export async function updateCollectionEntry(
  entryPath: string,
  updates: Partial<CollectionEntryProperties>,
): Promise<CollectionEntry> {
  // Get the entry
  const entry = getCollectionEntry(entryPath, true);
  // Get the collection
  const collection = getCollection(entry.collectionPath, true);
  // Get the collection type config
  const config = getCollectionTypeConfig(collection.type);

  // Ensure that the updates do not contain a title property, which should only be
  // updated via the renameCollectionEntry function.
  if (updates.title !== undefined) {
    throw new InvalidParameterError(
      'The title property cannot be updated via the updateCollectionEntry function. Use the renameCollectionEntry function instead.',
    );
  }

  // Merge updates into the existing properties and update the last modified timestamp
  let updatedEntry = {
    ...entry,
    properties: {
      ...entry.properties,
      ...updates,
      lastModified: new Date(),
    },
  };

  // Update the entry in the store
  updateInStore(entry.path, updatedEntry);

  // If the collection is text based, rewrite the entry files
  if (config.type === 'text') {
    writeTextCollectionEntry(updatedEntry);
  }

  // If the collection is file based, update the entry properties file
  if (config.type === 'file') {
    writeCollectionEntryProperties(
      collection.path,
      entry.properties.title,
      updatedEntry.properties,
    );
  }

  // Dispatch a entry updated event
  Events.dispatch('collections:entry:update', updatedEntry);

  return updatedEntry;
}
