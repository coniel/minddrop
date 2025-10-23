import { Fs } from '@minddrop/file-system';
import { titleFromPath } from '@minddrop/utils';
import { createItem } from '../createItem/createItem';
import { Item } from '../types';

/**
 * Creates an item of the specified type from the provided file.
 *
 * The item's title is derived from the file name (without extension).
 *
 * @param file - The file to create the item from.
 * @param type - The item type.
 *
 * @returns A promise that resolves to the created item.
 */
export async function createItemFromFile(
  type: string,
  file: File,
): Promise<Item> {
  // Use the file name (without extension) as the item title
  const title = titleFromPath(file.name);

  // Create the item
  const item = await createItem(
    type,
    title,
    {},
    Fs.getFileExtension(file.name),
  );

  // Write the item's file to the item type directory
  await Fs.writeBinaryFile(item.path, file);

  return item;
}
