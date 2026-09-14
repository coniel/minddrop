import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { DatabaseEntryTemplatesStore } from '../DatabaseEntryTemplatesStore';
import { DatabaseEntryTemplateDeletedEvent } from '../events';
import { getDatabase } from '../getDatabase';
import { getDatabaseEntryTemplate } from '../getDatabaseEntryTemplate';
import { updateDatabase } from '../updateDatabase';
import { resolveDatabasePath, resolveEntryTemplateDirPath } from '../utils';

/**
 * Deletes an entry template along with the template's directory.
 * Does nothing if the template does not exist.
 *
 * @param templateId - The ID of the template to delete.
 *
 * @throws {DatabaseNotFoundError} If the template's database does not exist.
 *
 * @dispatches databases:entry-template:deleted
 */
export async function deleteDatabaseEntryTemplate(
  templateId: string,
): Promise<void> {
  // Get the template, return early if it does not exist
  const template = getDatabaseEntryTemplate(templateId, false);

  if (!template) {
    return;
  }

  // Remove the template from the store
  DatabaseEntryTemplatesStore.remove(templateId);

  // Dispatch the entry template deleted event
  Events.dispatch(DatabaseEntryTemplateDeletedEvent, template);

  // Get the database
  const database = getDatabase(template.database);

  // Path to the template's directory
  const templateDir = resolveEntryTemplateDirPath(
    resolveDatabasePath(database),
    templateId,
  );

  // Delete the template's directory and its files if it exists
  if (await Fs.exists(templateDir)) {
    await Fs.removeDir(templateDir, { recursive: true });
  }

  // Remove the template from the database's template ID list if
  // present.
  if (database.entryTemplates.includes(templateId)) {
    await updateDatabase(database.id, {
      entryTemplates: database.entryTemplates.filter((id) => id !== templateId),
    });
  }
}
