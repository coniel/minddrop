import { EntryTemplateConfigFileName } from '../constants';
import { resolveEntryTemplateDirPath } from './resolveEntryTemplateDirPath';

/**
 * Generates the path to an entry template's config file inside the
 * template's directory.
 *
 * @param databasePath - The database directory path.
 * @param templateId - The ID of the entry template.
 *
 * @returns The path to the template's config file.
 */
export function resolveEntryTemplateConfigFilePath(
  databasePath: string,
  templateId: string,
): string {
  return `${resolveEntryTemplateDirPath(databasePath, templateId)}/${EntryTemplateConfigFileName}`;
}
