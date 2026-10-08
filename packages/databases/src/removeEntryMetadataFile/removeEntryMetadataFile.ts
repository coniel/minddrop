import { Fs } from '@minddrop/file-system';
import { resolveEntryMetadataFilePath } from '../utils';

/**
 * Removes an entry's metadata sidecar. No-op if the entry has no
 * sidecar.
 *
 * @param databasePath - The absolute path to the database directory.
 * @param entryPath - The entry's path.
 */
export async function removeEntryMetadataFile(
  databasePath: string,
  entryPath: string,
): Promise<void> {
  // Resolve the sidecar's path
  const filePath = resolveEntryMetadataFilePath(databasePath, entryPath);

  // Check the sidecar exists. An entry which never had metadata has
  // none.
  if (!(await Fs.exists(filePath))) {
    return;
  }

  // Remove the sidecar
  await Fs.removeFile(filePath);
}
