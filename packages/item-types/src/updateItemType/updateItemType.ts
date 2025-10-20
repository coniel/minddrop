import { Events } from '@minddrop/events';
import { ItemTypeConfigsStore } from '../ItemTypeConfigsStore';
import { getItemTypeConfig } from '../getItemTypeConfig';
import { ItemTypeConfig } from '../types';
import { writeItemTypeConfig } from '../writeItemTypeConfig';

export type UpdateItemTypeData = Partial<Omit<ItemTypeConfig, 'type'>>;

/**
 * Updates an item type.
 *
 * @param type - The item type to update.
 * @param data - The data to update the item type with.
 * @returns The updated item type config.
 *
 * @dispatches item-types:item-type:update
 */
export async function updateItemType(
  type: string,
  data: UpdateItemTypeData,
): Promise<ItemTypeConfig> {
  // Get the item type config
  const config = getItemTypeConfig(type);

  // Merge in the new data
  const updatedConfig = {
    ...config,
    ...data,
  };

  // Update the item type in the store
  ItemTypeConfigsStore.update(type, updatedConfig);

  // Write the updated config to the file system
  await writeItemTypeConfig(type);

  // Dispatch a item type updated event
  Events.dispatch('item-types:item-type:update', updatedConfig);

  return updatedConfig;
}
