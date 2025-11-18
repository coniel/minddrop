import { Fs } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { AssetsDirName } from '../constants';
import { getDatabaseEntry } from '../getDatabaseEntry';

/**
 * Ensures the specified entry's assets directory exists. Creates the directory
 * if it does not, including the parent 'assets' directory if necessary.
 *
 * @param id - The ID of the entry to ensure the assets directory for.
 *
 * @returns A promise that resolves when the operation is complete.
 */
export async function ensureDatabaseEntryAssetsDirExists(
  id: string,
): Promise<void> {
  // Get the entry
  const entry = getDatabaseEntry(id);

  // The path to the assets directory inside the entry's parent directory
  const entryTypeAssetsDirPath = Fs.concatPath(
    Fs.parentDirPath(entry.path),
    Paths.hiddenDirName,
    AssetsDirName,
  );

  // Ensure the assets directory exists
  if (!(await Fs.exists(entryTypeAssetsDirPath))) {
    await Fs.createDir(entryTypeAssetsDirPath);
  }

  // The path to the entry's assets directory
  const entryAssetsDirPath = Fs.concatPath(entryTypeAssetsDirPath, entry.title);

  // Ensure the entry's assets directory exists
  if (!(await Fs.exists(entryAssetsDirPath))) {
    await Fs.createDir(entryAssetsDirPath);
  }
}
