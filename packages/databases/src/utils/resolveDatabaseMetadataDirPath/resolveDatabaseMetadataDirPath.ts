import { Paths } from '@minddrop/utils';
import { MetadataDirName } from '../../constants';

/**
 * Returns the path to a database's metadata directory, which holds
 * one sidecar per entry.
 *
 * @param databasePath - The absolute path to the database directory.
 * @returns The path to the metadata directory.
 */
export function resolveDatabaseMetadataDirPath(databasePath: string): string {
  return `${databasePath}/${Paths.hiddenDirName}/${MetadataDirName}`;
}
