import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { DatabaseEntryTemplateRemovedEvent } from '../events';
import { getDatabase } from '../getDatabase';
import { Database } from '../types';
import { updateDatabase } from '../updateDatabase';
import { entryTemplateDirPath } from '../utils';

/**
 * Removes an entry template from a database, deleting the template's
 * file directory along with it. Does nothing if the template does
 * not exist.
 *
 * @param databaseId - The ID of the database to remove the template from.
 * @param templateId - The ID of the template to remove.
 * @returns The updated database config.
 *
 * @throws {DatabaseNotFoundError} If the database does not exist.
 *
 * @dispatches databases:entry-template:removed
 */
export async function removeDatabaseEntryTemplate(
  databaseId: string,
  templateId: string,
): Promise<Database> {
  // Get the database config
  const database = getDatabase(databaseId);

  // Find the template to remove
  const template = database.entryTemplates?.find(
    (entryTemplate) => entryTemplate.id === templateId,
  );

  // Filter the template from the entry templates list
  const entryTemplates = (database.entryTemplates ?? []).filter(
    (entryTemplate) => entryTemplate.id !== templateId,
  );

  // Path to the template's file directory
  const templateDir = entryTemplateDirPath(database.path, templateId);

  // Delete the template's file directory if it exists
  if (await Fs.exists(templateDir)) {
    await Fs.removeDir(templateDir);
  }

  // Update the database
  const updatePromise = updateDatabase(databaseId, { entryTemplates });

  // Get the updated config
  const updated = getDatabase(databaseId);

  if (template) {
    // Dispatch the entry template removed event
    Events.dispatch(DatabaseEntryTemplateRemovedEvent, {
      database: updated,
      template,
    });
  }

  await updatePromise;

  return updated;
}
