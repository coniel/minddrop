import { Paths } from '@minddrop/utils';
import { DatabaseConfigFileName } from '../../constants';

/**
 * Checks whether a path is a database's config file, which is what
 * marks its parent directory as a database.
 *
 * @param path - The path to check.
 * @returns Whether the path is a database config file.
 */
export function isDatabaseConfigFilePath(path: string): boolean {
  return path.endsWith(`/${Paths.hiddenDirName}/${DatabaseConfigFileName}`);
}
