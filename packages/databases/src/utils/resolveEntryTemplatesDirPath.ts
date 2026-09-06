import { Paths } from '@minddrop/utils';
import { EntryTemplatesDirName } from '../constants';

/**
 * Generates the path to the entry templates directory inside the
 * database's hidden directory.
 *
 * @param databasePath - The database directory path.
 *
 * @returns The path to the entry templates directory.
 */
export function resolveEntryTemplatesDirPath(databasePath: string): string {
  return `${databasePath}/${Paths.hiddenDirName}/${EntryTemplatesDirName}`;
}
