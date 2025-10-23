import { Fs } from '@minddrop/file-system';
import { ItemTypes } from '@minddrop/item-types';
import { getFileExtensionFromUrl } from '@minddrop/utils';
import { AssetsDirPath } from '../constants';
import { ensureItemAssetsDirExists } from '../ensureItemAssetsDirExists';
import { getItem } from '../getItem';

/**
 * Downloads an asset from a URL and saves it to the specified item's assets
 * directory. Replaces any existing asset with the same name.
 *
 * @param path - The path of the item to download the asset for.
 * @param url - The URL of the asset to download.
 * @param fileName - The name to save the downloaded asset as (without extension).
 *
 * @returns A promise that resolves to the downloaded asset's file name or false
 *          if the download failed.
 */
export async function downloadItemAsset(
  path: string,
  url: string,
  fileName: string,
): Promise<string | false> {
  // Get the item
  const item = getItem(path);
  // Get the item type config
  const typeConfig = ItemTypes.get(item.type);

  // Generate paths
  const itemTypeAssetsDirPath = Fs.concatPath(
    ItemTypes.dirPath(typeConfig),
    AssetsDirPath,
  );
  const assetFileExtension = getFileExtensionFromUrl(url);
  const assetFileName = assetFileExtension
    ? `${fileName}.${assetFileExtension}`
    : fileName;
  // Item's assets directory path
  const itemAssetsDirPath = Fs.concatPath(itemTypeAssetsDirPath, item.title);
  // Full asset path
  const assetPath = Fs.concatPath(itemAssetsDirPath, assetFileName);

  // Ensure the item's assets directory exists
  await ensureItemAssetsDirExists(path);

  // Delete existing asset if it exists
  if (await Fs.exists(assetPath)) {
    await Fs.removeFile(assetPath);
  }

  try {
    // Download the asset to the item's assets directory
    await Fs.downloadFile(url, assetPath);
  } catch (error) {
    return false;
  }

  return assetFileName;
}
