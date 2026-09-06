import { Paths } from '@minddrop/utils';
import { DatabaseDesignsDirName } from '../constants';

/**
 * Generates the path to the database's designs directory inside its
 * hidden directory.
 *
 * @param databasePath - The database directory path.
 *
 * @returns The path to the designs directory.
 */
export function resolveDatabaseDesignsDirPath(databasePath: string): string {
  return `${databasePath}/${Paths.hiddenDirName}/${DatabaseDesignsDirName}`;
}
