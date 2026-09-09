import { Fs } from '@minddrop/file-system';
import { getDatabase } from '../getDatabase';
import { getDatabaseEntryTemplate } from '../getDatabaseEntryTemplate';
import {
  resolveDatabasePath,
  resolveEntryTemplateConfigFilePath,
  resolveEntryTemplateDirPath,
  serializeDatabaseEntryTemplate,
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
  const databasePath = resolveDatabasePath(database);

  await Fs.ensureDir(resolveEntryTemplateDirPath(databasePath, template.id));

  // Write the template config to the file system
  await Fs.writeJsonFile(
    resolveEntryTemplateConfigFilePath(databasePath, template.id),
    serializeDatabaseEntryTemplate(template),
  );
}
