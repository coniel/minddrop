import { Paths } from '@minddrop/utils';
import { DatabaseViewsDirName } from '../constants';

/**
 * Generates the path to the database's views directory inside its
 * hidden directory.
 *
 * @param databasePath - The database directory path.
 *
 * @returns The path to the views directory.
 */
export function resolveDatabaseViewsDirPath(databasePath: string): string {
  return `${databasePath}/${Paths.hiddenDirName}/${DatabaseViewsDirName}`;
}
