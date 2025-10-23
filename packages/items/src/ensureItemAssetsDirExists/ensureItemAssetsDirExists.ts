import { Fs } from '@minddrop/file-system';
import { ItemTypes } from '@minddrop/item-types';
import { AssetsDirPath } from '../constants';
import { getItem } from '../getItem';

/**
 * Ensures the specified item's assets directory exists. Creates the directory
 * if it does not, including the item type's assets directory if necessary.
 *
 * @param path - The path of the item to ensure the assets directory for.
 *
 * @returns A promise that resolves when the operation is complete.
 */
export async function ensureItemAssetsDirExists(path: string): Promise<void> {
  // Get the item
  const item = getItem(path);
  // Get the item type config
  const typeConfig = ItemTypes.get(item.type);

  const itemTypeAssetsDirPath = Fs.concatPath(
    ItemTypes.dirPath(typeConfig),
    AssetsDirPath,
  );

  // Ensure the item type's assets directory exists
  if (!(await Fs.exists(itemTypeAssetsDirPath))) {
    await Fs.createDir(itemTypeAssetsDirPath);
  }

  const itemAssetsDirPath = Fs.concatPath(itemTypeAssetsDirPath, item.title);

  // Ensure the item's assets directory exists
  if (!(await Fs.exists(itemAssetsDirPath))) {
    await Fs.createDir(itemAssetsDirPath);
  }
}
