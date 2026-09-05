import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { entityId } from '@minddrop/utils';
import { DatabaseEntryTemplateAddedEvent } from '../events';
import { getDatabase } from '../getDatabase';
import {
  Database,
  DatabaseEntryTemplate,
  DatabaseEntryTemplateData,
} from '../types';
import { updateDatabase } from '../updateDatabase';
import {
  entryTemplateDirPath,
  entryTemplateFilePath,
  pruneEmptyPropertyValues,
} from '../utils';

/**
 * Adds an entry template to a database. Files provided for file based
 * property values are copied into the template's directory inside the
 * database's hidden dir, and the resulting file names are stored as
 * the property values.
 *
 * @param databaseId - The ID of the database to add the template to.
 * @param template - The template to add.
 * @param files - A property name to source file path map of files to copy into the template.
 * @returns The updated database config.
 *
 * @throws {DatabaseNotFoundError} If the database does not exist.
 *
 * @dispatches databases:entry-template:added
 */
export async function addDatabaseEntryTemplate(
  databaseId: string,
  template: DatabaseEntryTemplateData,
  files: Record<string, string> = {},
): Promise<Database> {
  // Get the database config
  const database = getDatabase(databaseId);

  // Generate an ID for the new template
  const id = entityId('database-entry-template');

  // Drop empty property values
  const properties = pruneEmptyPropertyValues(template.properties);

  // Copy each provided file into the template's directory
  for (const [propertyName, sourcePath] of Object.entries(files)) {
    // Ensure the template directory exists
    await Fs.ensureDir(entryTemplateDirPath(database.path, id));

    // Increment the file name if a file with the same name exists
    const { path, name } = await Fs.incrementalPath(
      entryTemplateFilePath(database.path, id, Fs.fileNameFromPath(sourcePath)),
    );

    // Copy the file into the template directory
    await Fs.copyFile(sourcePath, path);

    // Store the file name as the property value
    properties[propertyName] = name;
  }

  // The new template
  const newTemplate: DatabaseEntryTemplate = {
    ...template,
    id,
    properties,
  };

  // Append the template to the database's entry templates
  const entryTemplates = [...(database.entryTemplates ?? []), newTemplate];

  // Update the database
  const updatePromise = updateDatabase(databaseId, { entryTemplates });

  // Get the updated config
  const updated = getDatabase(databaseId);

  // Dispatch the entry template added event
  Events.dispatch(DatabaseEntryTemplateAddedEvent, {
    database: updated,
    template: newTemplate,
  });

  await updatePromise;

  return updated;
}
