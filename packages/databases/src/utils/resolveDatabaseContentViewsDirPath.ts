import { Paths } from '@minddrop/utils';
import { DatabaseContentViewsDirName } from '../constants';

/**
 * Generates the path to the database's content views directory inside
 * its hidden directory.
 *
 * @param databasePath - The database directory path.
 *
 * @returns The path to the content views directory.
 */
export function resolveDatabaseContentViewsDirPath(
  databasePath: string,
): string {
  return `${databasePath}/${Paths.hiddenDirName}/${DatabaseContentViewsDirName}`;
}
