import { Fs } from '@minddrop/file-system';
import { resolveEntryMetadataFilePath } from '../utils';

/**
 * Moves an entry's metadata sidecar to follow the entry to its new
 * path, so that persisted metadata such as saved view configs is not
 * orphaned by a rename.
 *
 * No-op if the entry has no sidecar.
 *
 * @param databasePath - The absolute path to the database directory.
 * @param oldPath - The entry's previous absolute path.
 * @param newPath - The entry's new absolute path.
 */
export async function moveEntryMetadataFile(
  databasePath: string,
  oldPath: string,
  newPath: string,
): Promise<void> {
  const oldFilePath = resolveEntryMetadataFilePath(databasePath, oldPath);

  // Entries which never had metadata have nothing to move
  if (!(await Fs.exists(oldFilePath))) {
    return;
  }

  // Sidecars are siblings in one directory, so a rename is a rename
  await Fs.rename(
    oldFilePath,
    resolveEntryMetadataFilePath(databasePath, newPath),
  );
}
