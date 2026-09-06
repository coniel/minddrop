import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { Properties } from '@minddrop/properties';
import { InvalidParameterError } from '@minddrop/utils';
import { DatabaseEntryTemplatesStore } from '../DatabaseEntryTemplatesStore';
import { copyEntryTemplateFiles } from '../copyEntryTemplateFiles';
import { DatabaseEntryTemplateUpdatedEvent } from '../events';
import { getDatabase } from '../getDatabase';
import { getDatabaseEntryTemplate } from '../getDatabaseEntryTemplate';
import {
  DatabaseEntryTemplate,
  UpdateDatabaseEntryTemplateData,
} from '../types';
import {
  pruneEmptyPropertyValues,
  resolveEntryTemplateFilePath,
} from '../utils';
import { writeDatabaseEntryTemplate } from '../writeDatabaseEntryTemplate';

/**
 * Updates an entry template. When provided, the `properties` field
 * replaces the template's property values wholesale. Files provided
 * for file based property values are copied into the template's
 * directory, replacing (and deleting) previously stored files.
 * Stored files whose property value is cleared are also deleted.
 *
 * @param templateId - The ID of the template to update.
 * @param data - The data to update the template with.
 * @param files - A property name to source file path map of files to copy into the template.
 * @returns The updated entry template.
 *
 * @throws {DatabaseEntryTemplateNotFoundError} If the template does not exist.
 * @throws {DatabaseNotFoundError} If the template's database does not exist.
 * @throws {InvalidParameterError} If a file based property value is changed without a provided file.
 *
 * @dispatches databases:entry-template:updated
 */
export async function updateDatabaseEntryTemplate(
  templateId: string,
  data: UpdateDatabaseEntryTemplateData,
  files: Record<string, string> = {},
): Promise<DatabaseEntryTemplate> {
  // Get the existing template
  const template = getDatabaseEntryTemplate(templateId);

  // Get the database config
  const database = getDatabase(template.database);

  // Drop empty values from the new property values
  const properties = pruneEmptyPropertyValues(
    data.properties ?? template.properties,
  );

  // Reject file based property values changed directly: the values
  // are the names of stored files, so a new value must come from a
  // provided file.
  for (const propertySchema of database.properties) {
    // Ignore non file based properties
    if (!Properties.isFileBased(propertySchema)) {
      continue;
    }

    const newValue = properties[propertySchema.name];

    // Cleared values and values backed by a provided file are fine
    if (newValue === undefined || propertySchema.name in files) {
      continue;
    }

    if (newValue !== template.properties[propertySchema.name]) {
      throw new InvalidParameterError(
        `Cannot set file based property '${propertySchema.name}' directly; provide a file instead.`,
      );
    }
  }

  // Delete stored files belonging to cleared or replaced file
  // based property values.
  for (const propertySchema of database.properties) {
    // Ignore non file based properties
    if (!Properties.isFileBased(propertySchema)) {
      continue;
    }

    // The previously stored file name, if any
    const oldFileName = template.properties[propertySchema.name];

    // Ignore properties without a previously stored file
    if (typeof oldFileName !== 'string' || !oldFileName) {
      continue;
    }

    // Whether the value was cleared from the new property values
    const cleared = !(propertySchema.name in properties);
    // Whether a new file was provided for the property
    const replaced = propertySchema.name in files;

    if (cleared || replaced) {
      // Path to the previously stored file
      const oldFilePath = resolveEntryTemplateFilePath(
        database.path,
        templateId,
        oldFileName,
      );

      // Delete the previously stored file
      if (await Fs.exists(oldFilePath)) {
        await Fs.removeFile(oldFilePath);
      }
    }
  }

  // Store provided files in the template's directory
  const storedFileNames = await copyEntryTemplateFiles(
    database.path,
    templateId,
    files,
  );

  // The updated template, using the stored files' names as their
  // properties' values.
  const updatedTemplate: DatabaseEntryTemplate = {
    ...template,
    ...data,
    properties: { ...properties, ...storedFileNames },
    lastModified: new Date(),
  };

  // Update the template in the store
  DatabaseEntryTemplatesStore.set(updatedTemplate);

  // Dispatch the entry template updated event
  Events.dispatch(DatabaseEntryTemplateUpdatedEvent, updatedTemplate);

  // Write the template's config file
  await writeDatabaseEntryTemplate(templateId);

  return updatedTemplate;
}
