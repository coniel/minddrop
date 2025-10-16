import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { i18n } from '@minddrop/i18n';
import { CollectionEntriesStore } from '../CollectionEntriesStore';
import { getCollection } from '../getCollection';
import { getCollectionTypeConfig } from '../getCollectionTypeConfig';
import {
  CollectionEntry,
  CollectionEntryProperties,
  TextCollectionTypeConfig,
} from '../types';
import { generateDefaultCollectionEntryProperties } from '../utils';
import { writeTextCollectionEntry } from '../writeTextCollectionEntry';

/**
 * Creates a new text collection entry in the collection and writes it to the file system.
 *
 * @param collectionPath - The path to the collection directory.
 * @param customProperties - Optional custom properties to set on the entry.
 * @returns The created entry.
 *
 * @dispatches collections:entries:create
 *
 * @throws {CollectionNotFoundError} If the collection does not exist.
 * @throws {CollectionTypeNotRegisteredError} If the collection type is not registered.
 */
export async function createTextCollectionEntry<
  TEntry extends CollectionEntry = CollectionEntry,
>(
  collectionPath: string,
  customProperties: Partial<CollectionEntryProperties> = {},
): Promise<TEntry> {
  // Get the collection
  const collection = getCollection(collectionPath, true);
  // Get the collection type config
  const config = getCollectionTypeConfig<TextCollectionTypeConfig>(
    collection.type,
  );
  // Use the default entry title if one is not provided
  let title = customProperties?.title || i18n.t('labels.untitled');
  // Use the entry title as the file name
  let fileName = `${title}.${config.fileExtension}`;
  // Generate the entry path
  let entryPath = Fs.concatPath(collectionPath, fileName);

  // Ensure that the entry file name does not conflict with an existing file
  const { increment } = await Fs.incrementalPath(entryPath);

  // Update entry path if there is a conflict
  if (increment) {
    title = `${title} ${increment}`;
    fileName = `${title}.${config.fileExtension}`;
    entryPath = Fs.concatPath(collectionPath, fileName);
  }

  // Generate entry properties
  const properties: CollectionEntryProperties = {
    created: new Date(),
    lastModified: new Date(),
    note: config.requireNote ? '' : null,
    ...generateDefaultCollectionEntryProperties(collection),
    ...customProperties,
    title,
  };

  // Generate the entry object
  const entry: CollectionEntry = {
    collectionPath,
    path: entryPath,
    properties,
  };

  // Add the entry to the entries store
  CollectionEntriesStore.add(entry);

  // Write the entry to the file system
  await writeTextCollectionEntry(entry);

  // Dispatch the entry created event
  Events.dispatch('collections:entries:create', entry);

  return entry as TEntry;
}
