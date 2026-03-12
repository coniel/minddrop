import { Paths } from '@minddrop/utils';
import { MetadataFileName } from '../../constants';

/**
 * Returns the path to a database's metadata file.
 *
 * @param databasePath - The absolute path to the database directory.
 * @returns The path to the metadata file.
 */
export function databaseMetadataFilePath(databasePath: string): string {
  return `${databasePath}/${Paths.hiddenDirName}/${MetadataFileName}`;
}
