import { Fs } from '@minddrop/file-system';
import { Workspace } from '@minddrop/workspaces';
import { DatabaseEntryTemplatesStore } from '../DatabaseEntryTemplatesStore';
import { normalizeDatabaseConfigIds } from '../normalizeDatabaseConfigIds';
import { readDatabaseEntryTemplate } from '../readDatabaseEntryTemplate';
import { readDatabaseResourceFiles } from '../readDatabaseResourceFiles';
import { Database } from '../types';
import {
  resolveDatabasePath,
  resolveEntryTemplateConfigFilePath,
  resolveEntryTemplatesDirPath,
} from '../utils';

/**
 * Loads database entry templates from the databases' template
 * directories into the workspace's entry templates store record.
 * Normalizes each database config's template ID list against the
 * templates found.
 *
 * @param databases - The databases whose entry templates to load.
 * @param workspace - The workspace the databases belong to.
 */
export async function loadDatabaseEntryTemplates(
  databases: Database[],
  workspace: Workspace,
): Promise<void> {
  // Read each database's entry templates from disk. Each template is
  // a directory named by its ID, holding its config file.
  const reads = await Promise.all(
    databases.map((database) => {
      // Resolve the database's directory path
      const databasePath = resolveDatabasePath(database, workspace.path);

      // Read the template in each template directory
      return readDatabaseResourceFiles(
        resolveEntryTemplatesDirPath(databasePath),
        (templateDirPath) =>
          readDatabaseEntryTemplate(
            resolveEntryTemplateConfigFilePath(
              databasePath,
              Fs.fileNameFromPath(templateDirPath),
            ),
            database.id,
          ),
      );
    }),
  );

  // Normalize each config's template ID list against the templates
  // found. The IDs of templates which could not be read are kept.
  databases.forEach((database, index) => {
    normalizeDatabaseConfigIds(
      database.id,
      'entryTemplates',
      reads[index].resources,
      workspace.id,
      reads[index].unreadableIds,
    );
  });

  // Gather the templates read
  const templates = reads.flatMap((read) => read.resources);

  if (templates.length === 0) {
    return;
  }

  // Load the templates into the workspace's store record
  DatabaseEntryTemplatesStore.in(workspace.id).load(templates);
}
