import { Events } from '@minddrop/events';
import { Properties } from '@minddrop/properties';
import { InvalidParameterError, entityId } from '@minddrop/utils';
import { DatabaseEntryTemplatesStore } from '../DatabaseEntryTemplatesStore';
import { copyEntryTemplateFiles } from '../copyEntryTemplateFiles';
import { DatabaseEntryTemplateCreatedEvent } from '../events';
import { getDatabase } from '../getDatabase';
import { DatabaseEntryTemplate, DatabaseEntryTemplateData } from '../types';
import { updateDatabase } from '../updateDatabase';
import { pruneEmptyPropertyValues, resolveDatabasePath } from '../utils';
import { writeDatabaseEntryTemplate } from '../writeDatabaseEntryTemplate';

/**
 * Creates an entry template in a database. Files provided for file based
 * property values are copied into the template's directory inside the
 * database's hidden dir, and the resulting file names are stored as
 * the property values.
 *
 * @param databaseId - The ID of the database to add the template to.
 * @param template - The template to add.
 * @param files - A property name to source file path map of files to copy into the template.
 * @returns The new entry template.
 *
 * @throws {DatabaseNotFoundError} If the database does not exist.
 * @throws {InvalidParameterError} If a file based property value is set without a provided file.
 *
 * @dispatches databases:entry-template:created
 */
export async function createDatabaseEntryTemplate(
  databaseId: string,
  template: DatabaseEntryTemplateData,
  files: Record<string, string> = {},
): Promise<DatabaseEntryTemplate> {
  // Get the database config
  const database = getDatabase(databaseId);

  // Generate an ID for the new template
  const id = entityId('database-entry-template');

  // Drop empty property values
  const prunedProperties = pruneEmptyPropertyValues(template.properties);

  // Reject file based property values provided directly: the values
  // are the names of stored files, so they must come from provided
  // files.
  for (const propertySchema of database.properties) {
    // Ignore non file based properties
    if (!Properties.isFileBased(propertySchema)) {
      continue;
    }

    if (
      prunedProperties[propertySchema.name] !== undefined &&
      !(propertySchema.name in files)
    ) {
      throw new InvalidParameterError(
        `Cannot set file based property '${propertySchema.name}' directly; provide a file instead.`,
      );
    }
  }

  // Store provided files in the template's directory
  const storedFileNames = await copyEntryTemplateFiles(
    resolveDatabasePath(database),
    id,
    files,
  );

  // Use the stored files' names as their properties' values
  const properties = {
    ...prunedProperties,
    ...storedFileNames,
  };

  // The new template
  const newTemplate: DatabaseEntryTemplate = {
    ...template,
    id,
    database: database.id,
    properties,
    created: new Date(),
    lastModified: new Date(),
  };

  // Add the template to the store
  DatabaseEntryTemplatesStore.set(newTemplate);

  // Dispatch the entry template created event
  Events.dispatch(DatabaseEntryTemplateCreatedEvent, newTemplate);

  // Write the template's config file
  await writeDatabaseEntryTemplate(id);

  // Add the template to the database's template ID list
  await updateDatabase(databaseId, {
    entryTemplates: [...getDatabase(databaseId).entryTemplates, id],
  });

  return newTemplate;
}
