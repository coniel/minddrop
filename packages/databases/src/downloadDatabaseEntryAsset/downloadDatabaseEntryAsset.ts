import { Fs } from '@minddrop/file-system';
import { Paths, getFileExtensionFromUrl } from '@minddrop/utils';
import { AssetsDirName } from '../constants';
import { ensureDatabaseEntryAssetsDirExists } from '../ensureDatabaseEntryAssetsDirExists';
import { getDatabaseEntry } from '../getDatabaseEntry';

/**
 * Downloads an asset from a URL and saves it to the specified entry's assets
 * directory. Replaces any existing asset with the same name.
 *
 * @param path - The path of the entry to download the asset for.
 * @param url - The URL of the asset to download.
 * @param fileName - The name to save the downloaded asset as (without extension).
 *
 * @returns A promise that resolves to the downloaded asset's file name or false
 *          if the download failed.
 */
export async function downloadDatabaseEntryAsset(
  path: string,
  url: string,
  fileName: string,
): Promise<string | false> {
  // Get the entry
  const entry = getDatabaseEntry(path);

  const assetFileExtension = getFileExtensionFromUrl(url);
  const assetFileName = assetFileExtension
    ? `${fileName}.${assetFileExtension}`
    : fileName;
  // DatabaseEntry's assets directory path
  const entryAssetsDirPath = Fs.concatPath(
    Fs.parentDirPath(entry.path),
    Paths.hiddenDirName,
    AssetsDirName,
    entry.title,
  );
  // Full asset path
  const assetPath = Fs.concatPath(entryAssetsDirPath, assetFileName);

  // Ensure the entry's assets directory exists
  await ensureDatabaseEntryAssetsDirExists(path);

  // Delete existing asset if it exists
  if (await Fs.exists(assetPath)) {
    await Fs.removeFile(assetPath);
  }

  try {
    // Download the asset to the entry's assets directory
    await Fs.downloadFile(url, assetPath);
  } catch (error) {
    return false;
  }

  return assetFileName;
}
