import { readDatabaseMetadata } from '../../readDatabaseMetadata';
import { writeDatabaseMetadata } from '../../writeDatabaseMetadata';

/**
 * Re-keys a metadata entry in the database metadata file from
 * one entry ID to another. Used during rename so that persisted
 * metadata (e.g. saved view configs) follows the entry to its
 * new ID.
 *
 * No-op if the old key does not exist in the metadata file.
 *
 * @param databasePath - The absolute path to the database directory.
 * @param oldEntryId - The entry ID to re-key from.
 * @param newEntryId - The entry ID to re-key to.
 */
export async function rekeyDatabaseMetadata(
  databasePath: string,
  oldEntryId: string,
  newEntryId: string,
): Promise<void> {
  // Read the current metadata from disk
  const metadata = await readDatabaseMetadata(databasePath);

  // Nothing to do if the old key does not exist
  if (!(oldEntryId in metadata)) {
    return;
  }

  // Move the value from the old key to the new key
  metadata[newEntryId] = metadata[oldEntryId];
  delete metadata[oldEntryId];

  // Write the updated metadata back to disk
  await writeDatabaseMetadata(databasePath, metadata);
}
