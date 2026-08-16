import { Fs } from '@minddrop/file-system';
import { resolveDatabaseMetadataDirPath } from '../utils';

/**
 * Lists the entries which have a metadata sidecar in a database,
 * without reading the sidecars themselves.
 *
 * @param databasePath - The absolute path to the database directory.
 * @returns The sidecar names, each identifying an entry.
 */
export async function listEntryMetadataKeys(
  databasePath: string,
): Promise<string[]> {
  const metadataDirPath = resolveDatabaseMetadataDirPath(databasePath);

  // Databases which have never written metadata have no directory
  if (!(await Fs.exists(metadataDirPath))) {
    return [];
  }

  const files = await Fs.readDir(metadataDirPath);

  return files
    .filter((file) => file.path.endsWith('.json'))
    .map((file) => Fs.removeExtension(Fs.fileNameFromPath(file.path)));
}
