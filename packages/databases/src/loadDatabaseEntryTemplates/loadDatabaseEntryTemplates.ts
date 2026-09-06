import { Fs } from '@minddrop/file-system';
import { DatabaseEntryTemplatesStore } from '../DatabaseEntryTemplatesStore';
import { normalizeDatabaseConfigIds } from '../normalizeDatabaseConfigIds';
import {
  Database,
  DatabaseEntryTemplate,
  StoredDatabaseEntryTemplate,
} from '../types';
import {
  resolveEntryTemplateConfigFilePath,
  resolveEntryTemplatesDirPath,
} from '../utils';

/**
 * Loads database entry templates from the databases' template
 * directories into the entry templates store, normalizing each
 * database config's template ID list against the templates found.
 *
 * @param databases - The databases whose entry templates to load.
 */
export async function loadDatabaseEntryTemplates(
  databases: Database[],
): Promise<void> {
  // Read each database's entry templates from disk
  const templates = (
    await Promise.all(databases.map(readDatabaseEntryTemplates))
  ).flat();

  if (templates.length === 0) {
    return;
  }

  // Load the templates into the store
  DatabaseEntryTemplatesStore.load(templates);
}

/**
 * Reads a database's entry templates from its templates directory
 * and normalizes the config's template ID list against them.
 *
 * @param database - The database whose templates to read.
 * @returns The database's entry templates.
 */
async function readDatabaseEntryTemplates(
  database: Database,
): Promise<DatabaseEntryTemplate[]> {
  // Path to the database's templates directory
  const dirPath = resolveEntryTemplatesDirPath(database.path);

  // The stored templates read from the templates directory, empty
  // for databases without one.
  let storedTemplates: StoredDatabaseEntryTemplate[] = [];

  if (await Fs.exists(dirPath)) {
    // List the template directories
    const templateDirs = await Fs.readDir(dirPath);

    // Read each template's config file, dropping unreadable ones
    storedTemplates = (
      await Promise.all(
        templateDirs.map((templateDir) =>
          readEntryTemplateConfig(database.path, templateDir.path),
        ),
      )
    ).filter((template): template is StoredDatabaseEntryTemplate => !!template);
  }

  // Normalize the config's template ID list against the templates
  // found.
  normalizeDatabaseConfigIds(database.id, 'entryTemplates', storedTemplates);

  // Attach the database ID to each template
  return storedTemplates.map((template) => ({
    ...template,
    database: database.id,
  }));
}

/**
 * Reads a single entry template config from a template directory.
 *
 * @param databasePath - The database directory path.
 * @param templateDirPath - The path to the template's directory.
 * @returns The stored template, or null if reading fails.
 */
async function readEntryTemplateConfig(
  databasePath: string,
  templateDirPath: string,
): Promise<StoredDatabaseEntryTemplate | null> {
  // The template ID is the directory name
  const templateId = Fs.fileNameFromPath(templateDirPath);

  try {
    return await Fs.readJsonFile<StoredDatabaseEntryTemplate>(
      resolveEntryTemplateConfigFilePath(databasePath, templateId),
    );
  } catch {
    return null;
  }
}
