import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { i18n } from '@minddrop/i18n';
import { ItemTypes } from '@minddrop/item-types';
import { Properties, PropertyMap } from '@minddrop/properties';
import { titleFromPath } from '@minddrop/utils';
import { ItemsStore } from '../ItemsStore';
import { Item } from '../types';
import { writeItem } from '../writeItem';

/**
 * Creates a new item of the specified type.
 *
 * @param type - The item type.
 * @param title - The item title. Defaults to "Untitled".
 * @param fileExtension - The file extension for the item's main file. Defaults to "md".
 *
 * @returns The newly created item.
 *
 * @dispatches items:item:create
 */
export async function createItem<TProperties extends PropertyMap = PropertyMap>(
  type: string,
  title = i18n.t('labels.untitled'),
  properties: Partial<TProperties> = {},
  fileExtension = 'md',
): Promise<Item<TProperties>> {
  // Get the item type config
  const typeConfig = ItemTypes.get(type);
  // The main item file path
  const targetPath = Fs.concatPath(
    ItemTypes.dirPath(typeConfig),
    `${title}.${fileExtension}`,
  );

  // Increment the file name if an item with the same name exists.
  // Ignore the file extension to match existing items regardless of
  // their data type.
  const { name, path } = await Fs.incrementalPath(targetPath, true);

  // Create the new item
  const item: Item<TProperties> = {
    type,
    title: titleFromPath(name),
    path,
    created: new Date(),
    lastModified: new Date(),
    markdown: '',
    properties: Properties.defaults(typeConfig.properties, properties),
  };

  // Add the item to the store
  ItemsStore.add(item);

  // Werite the item to the file system
  await writeItem(path);

  // Dispatch a item created event
  Events.dispatch('items:item:create', item);

  return item;
}
