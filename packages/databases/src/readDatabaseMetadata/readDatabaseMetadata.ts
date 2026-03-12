import { Fs } from '@minddrop/file-system';
import { restoreDates } from '@minddrop/utils';
import { DatabaseEntryMetadata } from '../types';
import { databaseMetadataFilePath } from '../utils';

/**
 * Reads the metadata file for a database.
 *
 * @param databasePath - The absolute path to the database directory.
 * @returns A map of entry IDs to their metadata.
 */
export async function readDatabaseMetadata(
  databasePath: string,
): Promise<Record<string, DatabaseEntryMetadata>> {
  const filePath = databaseMetadataFilePath(databasePath);

  // Return an empty map if the metadata file does not exist
  if (!(await Fs.exists(filePath))) {
    return {};
  }

  // Read and parse the metadata file, restoring Date objects
  const raw = await Fs.readJsonFile(filePath);

  return restoreDates(raw);
}
