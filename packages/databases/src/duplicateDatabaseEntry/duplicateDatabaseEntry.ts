import { Collections } from '@minddrop/collections';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { Properties, PropertyMap } from '@minddrop/properties';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { createDatabaseEntry } from '../createDatabaseEntry';
import { ensurePropertyFileDirExists } from '../ensurePropertyFileDirExists';
import {
  DatabaseEntryDuplicatedEvent,
  DatabaseEntryDuplicatedEventData,
} from '../events';
import { getDatabase } from '../getDatabase';
import { getDatabaseEntry } from '../getDatabaseEntry';
import { DatabaseEntry, DatabaseEntryRenderSource } from '../types';
import { updateDatabaseEntryProperty } from '../updateDatabaseEntryProperty';
import { updateEntryMetadata } from '../updateEntryMetadata';
import { getIncrmentalPropertyFilePath, getPropertyFilePath } from '../utils';

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
 * @throws {DatabaseEntryNotFoundError} If the entry does not exist.
 * @throws {DatabaseNotFoundError} If the entry's database does not exist.
 *
 * @dispatches databases:entry:created
 * @dispatches databases:entry:duplicated
 */
export async function duplicateDatabaseEntry(
  id: string,
  source?: DatabaseEntryRenderSource,
): Promise<DatabaseEntry> {
  // Get the source entry, throwing if it does not exist
  const entry = getDatabaseEntry(id);

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
  // automatically on conflict) and simple values
  const duplicate = await createDatabaseEntry(
    database.id,
    entry.title,
    simpleProperties,
  );

  // Copy each file based property value's file to the duplicate
  for (const [propertyName, fileName] of Object.entries(fileProperties)) {
    // Path to the source entry's property file
    const sourcePath = getPropertyFilePath(entry.id, propertyName, fileName);

    // Skip the property if the source file is missing
    if (!(await Fs.exists(sourcePath))) {
      continue;
    }

    // Ensure the file's destination directory exists
    await ensurePropertyFileDirExists(duplicate.id, propertyName);

    // Get the destination path, incrementing the file name on conflict
    const { path, name } = await getIncrmentalPropertyFilePath(
      duplicate.id,
      propertyName,
      fileName,
    );

    // Copy the file to the duplicate's file location
    await Fs.copyFile(sourcePath, path);

    // Set the copied file as the duplicate's property value
    await updateDatabaseEntryProperty(duplicate.id, propertyName, name);
  }

  // Copy the source entry's supplementary metadata onto the duplicate
  if (Object.keys(entry.metadata).length > 0) {
    // Set the metadata on the stored duplicate
    DatabaseEntriesStore.update(duplicate.id, { metadata: entry.metadata });

    // Persist the metadata to the database metadata file
    updateEntryMetadata(duplicate.id, entry.metadata);
  }

  // The duplicate with its final property values
  const finalDuplicate = DatabaseEntriesStore.get(duplicate.id) ?? duplicate;

  // Dispatch the duplicated event before adding the duplicate to the
  // source collection so listeners can position the duplicate relative
  // to the original before it appears in the collection
  await Events.dispatch<DatabaseEntryDuplicatedEventData>(
    DatabaseEntryDuplicatedEvent,
    { original: entry, duplicate: finalDuplicate, source },
  );

  // Add the duplicate to the collection when duplicated from one
  if (source?.type === 'collection') {
    await Collections.addItems(source.id, [finalDuplicate.id]);
  }

  return finalDuplicate;
}
