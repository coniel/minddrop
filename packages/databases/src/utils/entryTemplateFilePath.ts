import { entryTemplateDirPath } from './entryTemplateDirPath';

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
export function entryTemplateFilePath(
  databasePath: string,
  templateId: string,
  fileName: string,
): string {
  return `${entryTemplateDirPath(databasePath, templateId)}/${fileName}`;
}
