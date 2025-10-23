import { Events } from '@minddrop/events';
import { Fs, PathConflictError } from '@minddrop/file-system';
import { titleFromPath } from '@minddrop/utils';
import { ItemsStore } from '../ItemsStore';
import { getItem } from '../getItem';
import { Item } from '../types';
import { itemAssetsDirPath, itemCorePropertiesFilePath } from '../utils';
import { writeItem } from '../writeItem';

/**
 * Renames an item, updating its title and the file names of its associated
 * files.
 *
 * @param path - The path of the item to rename.
 * @param newTitle - The new title for the item.
 * @returns The renamed item.
 *
 * @throws {PathConflictError} Thrown if an item already exists at the new path.
 */
export async function renameItem<TItem extends Item = Item>(
  path: string,
  newTitle: string,
  incrementTitleIfConflict = false,
): Promise<TItem> {
  let finalNewTitle = newTitle;
  const item = getItem<TItem>(path);
  const parentDir = Fs.parentDirPath(path);
  const corePropertiesPath = itemCorePropertiesFilePath(path);
  const fileExtension = Fs.getFileExtension(path);
  const newFileName = `${newTitle}.${fileExtension}`;
  let newPath = Fs.concatPath(parentDir, newFileName);

  // Ensure that there is no conflict at the new path
  if (await Fs.exists(newPath)) {
    if (!incrementTitleIfConflict) {
      throw new PathConflictError(newPath);
    }

    // Get an incremental path to avoid the conflict
    const { path, name } = await Fs.incrementalPath(newPath);

    finalNewTitle = titleFromPath(name);
    newPath = path;
  }

  // Rename the primary item file
  Fs.rename(path, newPath);
  // Rename the item's core properties file
  Fs.rename(corePropertiesPath, itemCorePropertiesFilePath(newPath));

  // Rename the item's assets directory if it exists
  const assetsDirPath = itemAssetsDirPath(path);

  if (await Fs.exists(assetsDirPath)) {
    const newAssetsDirPath = itemAssetsDirPath(newPath);
    Fs.rename(assetsDirPath, newAssetsDirPath);
  }

  // Update the item's title, path, and last modified date
  const renamedItem: TItem = {
    ...item,
    path: newPath,
    title: finalNewTitle,
    lastModified: new Date(),
  };

  // Update the item in the store by adding the renamed item
  // and removing the old item.
  ItemsStore.add(renamedItem);
  ItemsStore.remove(path);

  // Write the updated core properties to the renamed core properties file
  writeItem(newPath);

  // Dispatch an item rename event
  Events.dispatch('items:item:rename', renamedItem);

  // Return the renamed item
  return renamedItem;
}
