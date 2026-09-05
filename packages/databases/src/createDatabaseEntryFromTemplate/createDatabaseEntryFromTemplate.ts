import { Fs } from '@minddrop/file-system';
import { Properties, PropertyMap } from '@minddrop/properties';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { createDatabaseEntry } from '../createDatabaseEntry';
import { ensurePropertyFileDirExists } from '../ensurePropertyFileDirExists';
import { getDatabase } from '../getDatabase';
import { getDatabaseEntryTemplate } from '../getDatabaseEntryTemplate';
import { DatabaseEntry } from '../types';
import { updateDatabaseEntryProperty } from '../updateDatabaseEntryProperty';
import {
  entryTemplateFilePath,
  resolveIncrementalPropertyFilePath,
} from '../utils';

/**
 * Creates a new database entry from an entry template. Simple property
 * values are copied onto the entry as is. File based property values
 * are copied from the template's directory to the location dictated by
 * the database's property file storage configuration, with each entry
 * receiving its own unique copy.
 *
 * @param databaseId - The ID of the database to create the entry in.
 * @param templateId - The ID of the entry template to create the entry from.
 * @param properties - Property values the entry is created with, overriding the template's values.
 *
 * @returns The newly created entry.
 *
 * @throws {DatabaseNotFoundError} If the database does not exist.
 * @throws {DatabaseEntryTemplateNotFoundError} If the template does not exist.
 *
 * @dispatches databases:entry:created
 */
export async function createDatabaseEntryFromTemplate(
  databaseId: string,
  templateId: string,
  properties: PropertyMap = {},
): Promise<DatabaseEntry> {
  // Get the database config
  const database = getDatabase(databaseId);

  // Get the entry template
  const template = getDatabaseEntryTemplate(databaseId, templateId);

  // Simple property values copied onto the entry as is
  const simpleProperties: PropertyMap = {};
  // File based property values copied to the entry's file locations
  const fileProperties: Record<string, string> = {};

  // Partition the template's values against the current schema
  for (const [propertyName, value] of Object.entries(template.properties)) {
    // Find the property's schema
    const propertySchema = database.properties.find(
      (property) => property.name === propertyName,
    );

    // Ignore values whose property no longer exists on the database
    if (!propertySchema) {
      continue;
    }

    // Split off file based property values
    if (Properties.isFileBased(propertySchema)) {
      fileProperties[propertyName] = String(value);

      continue;
    }

    // Copy simple values as is
    simpleProperties[propertyName] = value;
  }

  // Drop template file values overridden by the given properties,
  // whose values win over the template's.
  for (const propertyName of Object.keys(properties)) {
    delete fileProperties[propertyName];
  }

  // Create the entry with the template's simple values overridden
  // by the given ones, using the template's default title if it
  // has one.
  const entry = await createDatabaseEntry(
    databaseId,
    template.defaultTitle || undefined,
    { ...simpleProperties, ...properties },
  );

  // Copy each file based property value's file to the entry
  for (const [propertyName, fileName] of Object.entries(fileProperties)) {
    // Path to the template's source file
    const sourcePath = entryTemplateFilePath(
      database.path,
      templateId,
      fileName,
    );

    // Skip the property if the source file is missing
    if (!(await Fs.exists(sourcePath))) {
      continue;
    }

    // Ensure the file's destination directory exists
    await ensurePropertyFileDirExists(entry.id, propertyName);

    // Get the destination path, incrementing the file name on conflict
    const { path, name } = await resolveIncrementalPropertyFilePath(
      entry.id,
      propertyName,
      fileName,
    );

    // Copy the file to the entry's file location
    await Fs.copyFile(sourcePath, path);

    // Set the copied file as the entry's property value
    await updateDatabaseEntryProperty(entry.id, propertyName, name);
  }

  // Return the entry with its final property values
  return DatabaseEntriesStore.get(entry.id) ?? entry;
}
