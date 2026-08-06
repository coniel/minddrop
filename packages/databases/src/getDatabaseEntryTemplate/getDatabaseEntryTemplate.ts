import { DatabaseEntryTemplateNotFoundError } from '../errors';
import { getDatabase } from '../getDatabase';
import { DatabaseEntryTemplate } from '../types';

/**
 * Returns a database entry template by ID.
 *
 * @param databaseId - The ID of the database the template belongs to.
 * @param templateId - The ID of the entry template.
 *
 * @returns The entry template.
 *
 * @throws {DatabaseNotFoundError} If the database does not exist.
 * @throws {DatabaseEntryTemplateNotFoundError} If the template does not exist.
 */
export function getDatabaseEntryTemplate(
  databaseId: string,
  templateId: string,
): DatabaseEntryTemplate {
  // Get the database config
  const database = getDatabase(databaseId);

  // Find the requested template
  const template = database.entryTemplates?.find(
    (entryTemplate) => entryTemplate.id === templateId,
  );

  // Ensure the template exists
  if (!template) {
    throw new DatabaseEntryTemplateNotFoundError(templateId);
  }

  return template;
}
