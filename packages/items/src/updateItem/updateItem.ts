import { Events } from '@minddrop/events';
import { PropertyMap } from '@minddrop/properties';
import { InvalidParameterError } from '@minddrop/utils';
import { ItemsStore } from '../ItemsStore';
import { getItem } from '../getItem';
import { Item } from '../types';
import { writeItem } from '../writeItem';

export interface ItemUpdateData {
  markdown?: string;
  image?: string;
  icon?: string;
  properties?: PropertyMap;
}

/**
 * Updates an existing item with the provided data.
 *
 * @param path - The path of the item to update.
 * @param data - The data to update the item with.
 *
 * @returns The updated item.
 *
 * @throws {ItemNotFoundError} If the item does not exist.
 *
 * @dispatches `items:item:update` event.
 */
export async function updateItem(
  path: string,
  data: ItemUpdateData,
): Promise<Item> {
  let hasValidUpdateData = false;
  // Clone the existing item
  const item = { ...getItem(path) };

  // Ensure title is not being updated
  if ('title' in data) {
    throw new InvalidParameterError(
      'Item title cannot be updated via updateItem. Use renameItem instead.',
    );
  }

  // Update item fields
  if (data.markdown !== undefined) {
    item.markdown = data.markdown;
    hasValidUpdateData = true;
  }

  if (data.image !== undefined) {
    item.image = data.image;
    hasValidUpdateData = true;
  }

  if (data.icon !== undefined) {
    item.icon = data.icon;
    hasValidUpdateData = true;
  }

  if (data.properties !== undefined) {
    item.properties = {
      ...item.properties,
      ...data.properties,
    };
    hasValidUpdateData = true;
  }

  // If no valid update data was provided, return the item as is
  if (!hasValidUpdateData) {
    return item;
  }

  // Update the last modified date
  item.lastModified = new Date();

  // Update the item in the store
  ItemsStore.update(path, item);

  // Write the updated item files to the file system
  await writeItem(path);

  // Dispatch item update event
  Events.dispatch('items:item:update', item);

  // Return the updated item
  return item;
}
