import { Fs } from '@minddrop/file-system';
import { restoreDates } from '@minddrop/utils';
import { DatabaseEntryMetadata } from '../types';
import { resolveEntryMetadataFilePath } from '../utils';

/**
 * Reads an entry's metadata sidecar.
 *
 * @param databasePath - The absolute path to the database directory.
 * @param entryPath - The absolute path of the entry file.
 * @returns The entry's metadata, or an empty object if it has none.
 */
export async function readEntryMetadata(
  databasePath: string,
  entryPath: string,
): Promise<DatabaseEntryMetadata> {
  const filePath = resolveEntryMetadataFilePath(databasePath, entryPath);

  // Entries without a sidecar simply have no metadata
  if (!(await Fs.exists(filePath))) {
    return {};
  }

  try {
    // Read and parse the sidecar, restoring Date objects
    const raw = await Fs.readJsonFile(filePath);

    return restoreDates(raw);
  } catch {
    // An unreadable sidecar holds no data worth failing over
    return {};
  }
}
