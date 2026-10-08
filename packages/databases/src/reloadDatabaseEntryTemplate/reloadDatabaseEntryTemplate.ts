import { Workspace } from '@minddrop/workspaces';
import { DatabaseEntryTemplatesStore } from '../DatabaseEntryTemplatesStore';
import { getDatabaseEntryTemplates } from '../getDatabaseEntryTemplates';
import { readDatabaseEntryTemplate } from '../readDatabaseEntryTemplate';
import { reloadDatabaseResource } from '../reloadDatabaseResource';
import { Database } from '../types';
import {
  resolveDatabasePath,
  resolveEntryTemplateConfigFilePath,
} from '../utils';

/**
 * Reloads an entry template from its config file into the workspace's
 * entry templates store record. Removes the template from the store if
 * its config file no longer exists. Leaves the store's template as it
 * is if the file cannot be read.
 *
 * Normalizes the database's template ID list in the store against the
 * database's loaded templates. Does not write the config file.
 *
 * @param database - The database the template belongs to.
 * @param templateId - The ID of the entry template to reload.
 * @param workspace - The workspace the database belongs to.
 *
 * @throws {DatabaseNotFoundError} If the database is not in the workspace's store record.
 */
export async function reloadDatabaseEntryTemplate(
  database: Database,
  templateId: string,
  workspace: Workspace,
): Promise<void> {
  // Get the workspace's entry templates store record
  const store = DatabaseEntryTemplatesStore.in(workspace.id);
  // Resolve the template's config file path
  const path = resolveEntryTemplateConfigFilePath(
    resolveDatabasePath(database, workspace.path),
    templateId,
  );

  // Reload the template
  await reloadDatabaseResource(database.id, workspace.id, {
    key: 'entryTemplates',
    read: () => readDatabaseEntryTemplate(path, database.id),
    load: (template) => store.set(template),
    unload: () => store.remove(templateId),
    getLoaded: () => getDatabaseEntryTemplates(database.id, workspace.id),
  });
}
