import { Fs } from '@minddrop/file-system';
import { DatabaseEntryMetadata } from '../types';
import { databaseMetadataFilePath } from '../utils';

/**
 * Writes the full metadata map for a database to disk.
 *
 * @param databasePath - The absolute path to the database directory.
 * @param metadata - The metadata map keyed by database-relative entry path.
 */
export async function writeDatabaseMetadata(
  databasePath: string,
  metadata: Record<string, DatabaseEntryMetadata>,
): Promise<void> {
  await Fs.writeJsonFile(databaseMetadataFilePath(databasePath), metadata);
}
