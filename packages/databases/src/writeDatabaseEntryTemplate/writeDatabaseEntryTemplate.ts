import { Fs } from '@minddrop/file-system';
import { getDatabase } from '../getDatabase';
import { getDatabaseEntryTemplate } from '../getDatabaseEntryTemplate';
import {
  resolveEntryTemplateConfigFilePath,
  resolveEntryTemplateDirPath,
} from '../utils';

/**
 * Writes an entry template's config file to the template's directory
 * inside the database's hidden dir.
 *
 * @param templateId - The ID of the entry template to write.
 *
 * @throws {DatabaseEntryTemplateNotFoundError} If the template does not exist.
 * @throws {DatabaseNotFoundError} If the template's database does not exist.
 */
export async function writeDatabaseEntryTemplate(
  templateId: string,
): Promise<void> {
  // Get the template
  const template = getDatabaseEntryTemplate(templateId);

  // Get the owning database for its path
  const database = getDatabase(template.database);

  // Ensure the template's directory exists
  await Fs.ensureDir(resolveEntryTemplateDirPath(database.path, template.id));

  // Exclude the database ID as it is derived from the file's location
  const { database: _database, ...config } = template;

  // Write the template config to the file system
  await Fs.writeJsonFile(
    resolveEntryTemplateConfigFilePath(database.path, template.id),
    config,
  );
}
