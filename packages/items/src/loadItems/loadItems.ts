import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { ItemTypeConfig, ItemTypes } from '@minddrop/item-types';
import { ItemsStore } from '../ItemsStore';
import { readItem } from '../readItem';
import { Item } from '../types';

/**
 * Loads items of the specified types from the file system into the ItemsStore.
 *
 * @param types - An array of item type configurations to load items for.
 */
export async function loadItems(types: ItemTypeConfig[]): Promise<void> {
  // An array of { type, files } objects for each item type, with a list of file paths
  // found inside the item type's directory.
  const itemFilesPromises: Promise<{ type: string; files: string[] }>[] = [];
  const itemPromises: Promise<Item | null>[] = [];

  // Get item file paths for each item type
  types.forEach((type) => {
    itemFilesPromises.push(getItemFilePaths(type));
  });

  const itemFiles = await Promise.all(itemFilesPromises);

  // Read each item file
  itemFiles.forEach(({ type, files }) => {
    files.forEach((filePath) => {
      itemPromises.push(readItem(type, filePath));
    });
  });

  const allItemPromises = itemPromises.flat();

  // Filter out null items
  const items = (await Promise.all(allItemPromises)).filter(
    (item): item is Item => item !== null,
  );

  // Load items into the ItemsStore
  ItemsStore.load(items);

  // Dispatch a items load event
  Events.dispatch('items:load', items);
}

async function getItemFilePaths(
  type: ItemTypeConfig,
): Promise<{ type: string; files: string[] }> {
  const itemDirPath = ItemTypes.dirPath(type);

  // IF the item type directory doesn't exist, pretend it's empty
  if (!(await Fs.exists(itemDirPath))) {
    return { type: type.nameSingular, files: [] };
  }

  const files = await Fs.readDir(itemDirPath);

  return {
    type: type.nameSingular,
    // Only return files that are not directories
    files: files.filter((file) => !file.children).map((file) => file.path),
  };
}
