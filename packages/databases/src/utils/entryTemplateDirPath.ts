import { Paths } from '@minddrop/utils';
import { EntryTemplatesDirName } from '../constants';

/**
 * Generates the path to an entry template's file directory inside
 * the database's hidden directory.
 *
 * @param databasePath - The database directory path.
 * @param templateId - The ID of the entry template.
 *
 * @returns The path to the template's directory.
 */
export function entryTemplateDirPath(
  databasePath: string,
  templateId: string,
): string {
  return `${databasePath}/${Paths.hiddenDirName}/${EntryTemplatesDirName}/${templateId}`;
}
