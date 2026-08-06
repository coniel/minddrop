import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { Properties } from '@minddrop/properties';
import {
  DatabaseEntryTemplateUpdatedEvent,
  DatabaseEntryTemplateUpdatedEventData,
} from '../events';
import { getDatabase } from '../getDatabase';
import { getDatabaseEntryTemplate } from '../getDatabaseEntryTemplate';
import {
  Database,
  DatabaseEntryTemplate,
  UpdateDatabaseEntryTemplateData,
} from '../types';
import { updateDatabase } from '../updateDatabase';
import {
  entryTemplateDirPath,
  entryTemplateFilePath,
  pruneEmptyPropertyValues,
} from '../utils';

/**
 * Updates an entry template on a database. When provided, the
 * `properties` field replaces the template's property values
 * wholesale. Files provided for file based property values are
 * copied into the template's directory, replacing (and deleting)
 * previously stored files. Stored files whose property value is
 * cleared are also deleted.
 *
 * @param databaseId - The ID of the database the template belongs to.
 * @param templateId - The ID of the template to update.
 * @param data - The data to update the template with.
 * @param files - A property name to source file path map of files to copy into the template.
 * @returns The updated database config.
 *
 * @throws {DatabaseNotFoundError} If the database does not exist.
 * @throws {DatabaseEntryTemplateNotFoundError} If the template does not exist.
 *
 * @dispatches databases:entry-template:updated
 */
export async function updateDatabaseEntryTemplate(
  databaseId: string,
  templateId: string,
  data: UpdateDatabaseEntryTemplateData,
  files: Record<string, string> = {},
): Promise<Database> {
  // Get the database config
  const database = getDatabase(databaseId);

  // Get the existing template
  const template = getDatabaseEntryTemplate(databaseId, templateId);

  // Drop empty values from the new property values
  const properties = pruneEmptyPropertyValues(
    data.properties ?? template.properties,
  );

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
      const oldFilePath = entryTemplateFilePath(
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

  // Copy each provided file into the template's directory
  for (const [propertyName, sourcePath] of Object.entries(files)) {
    // Ensure the template directory exists
    await Fs.ensureDir(entryTemplateDirPath(database.path, templateId));

    // Increment the file name if a file with the same name exists
    const { path, name } = await Fs.incrementalPath(
      entryTemplateFilePath(
        database.path,
        templateId,
        Fs.fileNameFromPath(sourcePath),
      ),
    );

    // Copy the file into the template directory
    await Fs.copyFile(sourcePath, path);

    // Store the file name as the property value
    properties[propertyName] = name;
  }

  // The updated template
  const updatedTemplate: DatabaseEntryTemplate = {
    ...template,
    ...data,
    properties,
  };

  // Replace the template in the entry templates list, preserving
  // its position.
  const entryTemplates = (database.entryTemplates ?? []).map((entryTemplate) =>
    entryTemplate.id === templateId ? updatedTemplate : entryTemplate,
  );

  // Update the database
  const updated = await updateDatabase(databaseId, { entryTemplates });

  // Dispatch the entry template updated event
  Events.dispatch<DatabaseEntryTemplateUpdatedEventData>(
    DatabaseEntryTemplateUpdatedEvent,
    { database: updated, template: updatedTemplate },
  );

  return updated;
}
