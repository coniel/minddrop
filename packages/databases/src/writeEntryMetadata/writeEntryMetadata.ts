import { Fs } from '@minddrop/file-system';
import { DatabaseEntryMetadata } from '../types';
import {
  resolveDatabaseMetadataDirPath,
  resolveEntryMetadataFilePath,
} from '../utils';

/**
 * Writes an entry's metadata sidecar, creating the metadata
 * directory structure if it does not exist.
 *
 * @param databasePath - The absolute path to the database directory.
 * @param entryPath - The absolute path of the entry file.
 * @param metadata - The entry's metadata.
 */
export async function writeEntryMetadata(
  databasePath: string,
  entryPath: string,
  metadata: DatabaseEntryMetadata,
): Promise<void> {
  const filePath = resolveEntryMetadataFilePath(databasePath, entryPath);

  // The metadata directory does not exist until the database's
  // first sidecar is written
  await Fs.ensureDir(resolveDatabaseMetadataDirPath(databasePath));

  await Fs.writeJsonFile(filePath, metadata);
}
