import { BaseItemTypes } from '@minddrop/base-item-types';
import { Events } from '@minddrop/events';
import { Fs, PathConflictError } from '@minddrop/file-system';
import { InvalidParameterError } from '@minddrop/utils';
import { ItemTypeConfigsStore } from '../ItemTypeConfigsStore';
import { ItemTypeConfig } from '../types';
import { itemsDirPath } from '../utils';
import { writeItemTypeConfig } from '../writeItemTypeConfig';

export type CreateItemTypeOptions = Omit<ItemTypeConfig, 'properties'>;

/**
 * Creates a new item type with the specified options.
 *
 * @param options - The item type creation options.
 * @returns The created item type config.
 *
 * @dispatches item-types:item-type:create
 */
export async function createItemType(
  options: CreateItemTypeOptions,
): Promise<ItemTypeConfig> {
  // The path to the item type directory where items will be stored
  const itemsDirectoryPath = itemsDirPath(options);
  // Get the base item type config
  const basteItemTypeConfig = BaseItemTypes.get(options.baseType);

  // Ensure the item type does not already exist
  if (ItemTypeConfigsStore.get(options.nameSingular)) {
    throw new InvalidParameterError(
      `An item type "${options.nameSingular}" already exists.`,
    );
  }

  // Ensure the item type directory does not already exist
  if (await Fs.exists(itemsDirectoryPath)) {
    throw new PathConflictError(itemsDirectoryPath);
  }

  // Generate the item type config
  const itemTypeConfig: ItemTypeConfig = {
    ...options,
    properties: basteItemTypeConfig.properties,
  };

  // Add the item type config to the store
  ItemTypeConfigsStore.add(itemTypeConfig);

  // Write the item type config to the file system
  await writeItemTypeConfig(options.nameSingular);

  // Create the item type directory in the workspace
  await Fs.createDir(itemsDirectoryPath);

  // Dispatch item type created event
  Events.dispatch('item-types:item-type:create', itemTypeConfig);

  return itemTypeConfig;
}
