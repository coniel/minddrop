import { resolveEntryTemplateDirPath } from './resolveEntryTemplateDirPath';

/**
 * Generates the path to a file stored in an entry template's
 * directory.
 *
 * @param databasePath - The database directory path.
 * @param templateId - The ID of the entry template.
 * @param fileName - The name of the file, i.e. the value of the property.
 *
 * @returns The path to the template file.
 */
export function resolveEntryTemplateFilePath(
  databasePath: string,
  templateId: string,
  fileName: string,
): string {
  return `${resolveEntryTemplateDirPath(databasePath, templateId)}/${fileName}`;
}
