import { Collections } from '@minddrop/collections';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { Properties, PropertyMap } from '@minddrop/properties';
import { EntriesStore } from '../EntriesStore';
import { createEntry } from '../createEntry';
import { ensurePropertyFileDirExists } from '../ensurePropertyFileDirExists';
import { EntryDuplicatedEvent } from '../events';
import { getDatabase } from '../getDatabase';
import { getEntry } from '../getEntry';
import { Entry, EntryRenderSource } from '../types';
import { updateEntryMetadata } from '../updateEntryMetadata';
import { updateEntryProperty } from '../updateEntryProperty';
import {
  resolveEntryPropertyFilePath,
  resolveIncrementalPropertyFilePath,
} from '../utils';

/**
 * Duplicates a database entry. Simple property values are copied onto
 * the duplicate as is. File based property values receive their own
 * copy of the source file, stored according to the database's property
 * file storage configuration. The duplicate's title is incremented if
 * the source title is taken.
 *
 * @param id - The ID of the entry to duplicate.
 * @param source - The source the entry was rendered from. When a collection, the duplicate is added to it.
 *
 * @returns The duplicated entry.
 *
 * @throws {EntryNotFoundError} If the entry does not exist.
 * @throws {DatabaseNotFoundError} If the entry's database does not exist.
 *
 * @dispatches databases:entry:created
 * @dispatches databases:entry:duplicated
 */
export async function duplicateEntry(
  id: string,
  source?: EntryRenderSource,
): Promise<Entry> {
  // Get the source entry, throwing if it does not exist
  const entry = getEntry(id);

  // Get the entry's database
  const database = getDatabase(entry.database);

  // Simple property values copied onto the duplicate as is
  const simpleProperties: PropertyMap = {};
  // File based property values copied to the duplicate's file locations
  const fileProperties: Record<string, string> = {};

  // Partition the source entry's values against the current schema
  for (const [propertyName, value] of Object.entries(entry.properties)) {
    // Find the property's schema
    const propertySchema = database.properties.find(
      (property) => property.name === propertyName,
    );

    // Ignore values whose property no longer exists on the database
    if (!propertySchema) {
      continue;
    }

    // Skip title values, the title is passed to create separately
    if (propertySchema.type === 'title') {
      continue;
    }

    // Split off file based property values, skipping empty values
    if (Properties.isFileBased(propertySchema)) {
      if (typeof value === 'string' && value !== '') {
        fileProperties[propertyName] = value;
      }

      continue;
    }

    // Copy simple values as is
    simpleProperties[propertyName] = value;
  }

  // Create the duplicate with the source entry's title (incremented
  // automatically on conflict) and simple values, marked with the
  // source entry as its origin.
  const duplicate = await createEntry(
    database.id,
    entry.title,
    simpleProperties,
    entry.id,
  );

  // Copy each file based property value's file to the duplicate
  for (const [propertyName, fileName] of Object.entries(fileProperties)) {
    // Path to the source entry's property file
    const sourcePath = resolveEntryPropertyFilePath(
      entry.id,
      propertyName,
      fileName,
    );

    // Skip the property if the source file is missing
    if (!(await Fs.exists(sourcePath))) {
      continue;
    }

    // Ensure the file's destination directory exists
    await ensurePropertyFileDirExists(duplicate.id, propertyName);

    // Get the destination path, incrementing the file name on conflict
    const { path, name } = await resolveIncrementalPropertyFilePath(
      duplicate.id,
      propertyName,
      fileName,
    );

    // Copy the file to the duplicate's file location
    await Fs.copyFile(sourcePath, path);

    // Set the copied file as the duplicate's property value
    await updateEntryProperty(duplicate.id, propertyName, name);
  }

  // Copy the source entry's supplementary metadata onto the duplicate
  if (Object.keys(entry.metadata).length > 0) {
    await updateEntryMetadata(duplicate.id, entry.metadata);
  }

  // The duplicate with its final property values
  const finalDuplicate = EntriesStore.get(duplicate.id) ?? duplicate;

  // Dispatch the duplicated event
  Events.dispatch(EntryDuplicatedEvent, {
    original: entry,
    duplicate: finalDuplicate,
    source,
  });

  // Add the duplicate to the collection when duplicated from one
  if (source?.type === 'collection') {
    await Collections.addItems(source.id, [finalDuplicate.id]);
  }

  return finalDuplicate;
}
