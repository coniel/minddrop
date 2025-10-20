import { BaseItemTypes } from '@minddrop/base-item-types';
import { Events } from '@minddrop/events';
import { ItemTypeConfigsStore } from '../ItemTypeConfigsStore';
import { ItemTypeConfig } from '../types';
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
  // Get the base item type config
  const basteItemTypeConfig = BaseItemTypes.get(options.baseType);

  // Generate the item type config
  const itemTypeConfig: ItemTypeConfig = {
    ...options,
    properties: basteItemTypeConfig.properties,
  };

  // Add the item type config to the store
  ItemTypeConfigsStore.add(itemTypeConfig);

  // Write the item type config to the file system
  await writeItemTypeConfig(options.type);

  // Dispatch item type created event
  Events.dispatch('item-types:item-type:create', itemTypeConfig);

  return itemTypeConfig;
}
