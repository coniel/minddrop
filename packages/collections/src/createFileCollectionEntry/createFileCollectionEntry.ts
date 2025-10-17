import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { CollectionEntriesStore } from '../CollectionEntriesStore';
import { InvalidCollectionTypeError } from '../errors';
import { getCollection } from '../getCollection';
import { getCollectionTypeConfig } from '../getCollectionTypeConfig';
import {
  FileCollectionEntry,
  FileCollectionEntryProperties,
  FileCollectionTypeConfig,
} from '../types';
import { generateDefaultCollectionEntryProperties } from '../utils';
import { writeCollectionEntryProperties } from '../writeCollectionEntryProperties';

/**
 * Creates a new file collection entry in the collection and writes it to the file system.
 *
 * @param collectionPath - The path to the collection directory.
 * @param file - The file to add as the collection entry.
 * @returns The created entry.
 *
 * @dispatches collections:entries:create
 *
 * @throws {CollectionNotFoundError} If the collection does not exist.
 * @throws {CollectionTypeNotRegisteredError} If the collection type is not registered.
 * @throws {InvalidCollectionTypeError} If the collection type is not a file type.
 */
export async function createFileCollectionEntry(
  collectionPath: string,
  file: File,
): Promise<FileCollectionEntry> {
  // Get the collection
  const collection = getCollection(collectionPath, true);
  // Get the collection type config
  const config = getCollectionTypeConfig<FileCollectionTypeConfig>(
    collection.type,
  );
  // Use the file name as the entry file name
  let fileName = file.name;
  // Get the file extension
  const extension = file.name.split('.').pop();
  // Use the file name (without extension) as the entry title
  let title = file.name.replace(`.${extension}`, '');
  // Generate the entry path
  let entryPath = Fs.concatPath(collectionPath, file.name);

  // Ensure that the collection is a file collection
  if (config.type !== 'file') {
    throw new InvalidCollectionTypeError(collection.path, 'file', config.type);
  }

  // Ensure that the entry file name does not conflict with an existing file
  const { increment } = await Fs.incrementalPath(entryPath);

  // Update entry path if there is a conflict
  if (increment) {
    title = `${title} ${increment}`;
    fileName = `${title}.${extension}`;
    entryPath = Fs.concatPath(collectionPath, fileName);
  }

  // Generate entry properties
  const properties: FileCollectionEntryProperties = {
    created: new Date(),
    lastModified: new Date(),
    note: null,
    ...generateDefaultCollectionEntryProperties(config, collection),
    fileName,
    title,
  };

  // Generate the entry object
  const entry: FileCollectionEntry = {
    collectionPath,
    path: entryPath,
    properties,
  };

  // Add the entry to the entries store
  CollectionEntriesStore.add(entry);

  // Write the entry to the file system
  await Fs.writeBinaryFile(entry.path, file);
  // Write the entry properties to the file system
  await writeCollectionEntryProperties(collectionPath, title, properties);

  // Dispatch the entry created event
  Events.dispatch('collections:entries:create', entry);

  return entry;
}
