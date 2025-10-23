import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { ItemTypes } from '@minddrop/item-types';
import { isMarkdownItemType } from '@minddrop/item-types/src/utils';
import { ItemsStore } from '../ItemsStore';
import { getItem } from '../getItem';
import {
  itemAssetsDirPath,
  itemCorePropertiesFilePath,
  itemUserPropertiesFilePath,
} from '../utils';

/**
 * Deletes an item and all its associated files.
 *
 * @param path - The item's file path.
 */
export async function deleteItem(path: string): Promise<void> {
  // Get the item
  const item = getItem(path);
  // Get the item type config
  const itemTypeConfig = ItemTypes.get(item.type);

  // Remove the item from the store
  ItemsStore.remove(path);

  // Move the item's primary file to the trash
  await Fs.trashFile(path);

  // Delete core properties file
  await Fs.removeFile(itemCorePropertiesFilePath(path));

  // Delete properties file if item is not markdown based
  if (!isMarkdownItemType(itemTypeConfig)) {
    await Fs.removeFile(itemUserPropertiesFilePath(path));
  }

  // Delete assets directory if it exists
  const assetsDirPath = itemAssetsDirPath(path);

  if (await Fs.exists(assetsDirPath)) {
    await Fs.removeDir(assetsDirPath);
  }

  // Dispatch an item delete event
  Events.dispatch('items:item:delete', item);
}
