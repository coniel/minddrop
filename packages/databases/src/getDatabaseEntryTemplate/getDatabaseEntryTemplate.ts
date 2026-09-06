import { DatabaseEntryTemplatesStore } from '../DatabaseEntryTemplatesStore';
import { DatabaseEntryTemplateNotFoundError } from '../errors';
import { DatabaseEntryTemplate } from '../types';

/**
 * Retrieves a database entry template from the store.
 *
 * @param templateId - The ID of the entry template.
 * @param throwOnNotFound - Whether to throw an error if the template is not found.
 * @returns The entry template.
 *
 * @throws {DatabaseEntryTemplateNotFoundError} If the template does not exist.
 */
export function getDatabaseEntryTemplate(
  templateId: string,
): DatabaseEntryTemplate;
export function getDatabaseEntryTemplate(
  templateId: string,
  throwOnNotFound: false,
): DatabaseEntryTemplate | null;
export function getDatabaseEntryTemplate(
  templateId: string,
  throwOnNotFound = true,
): DatabaseEntryTemplate | null {
  // Get the template from the store
  const template = DatabaseEntryTemplatesStore.get(templateId);

  // Throw an error if it doesn't exist, unless specified not to
  if (!template && throwOnNotFound) {
    throw new DatabaseEntryTemplateNotFoundError(templateId);
  }

  return template;
}
