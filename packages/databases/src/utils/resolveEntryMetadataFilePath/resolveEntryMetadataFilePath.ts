import { entryMetadataKey } from '../entryMetadataKey';
import { resolveDatabaseMetadataDirPath } from '../resolveDatabaseMetadataDirPath';

/**
 * Returns the path to an entry's metadata sidecar.
 *
 * @param databasePath - The absolute path to the database directory.
 * @param entryPath - The absolute path of the entry file.
 * @returns The path to the entry's metadata file.
 */
export function resolveEntryMetadataFilePath(
  databasePath: string,
  entryPath: string,
): string {
  const dirPath = resolveDatabaseMetadataDirPath(databasePath);

  return `${dirPath}/${entryMetadataKey(entryPath)}.json`;
}
