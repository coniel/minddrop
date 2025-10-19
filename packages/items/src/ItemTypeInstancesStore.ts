import { createArrayStore } from '@minddrop/utils';
import { ItemTypeInstance } from './types';

export const ItemTypeInstancesStore = createArrayStore<ItemTypeInstance>('id');

/**
 * Adds an item type instance.
 *
 * @param instance - The item type instance to register.
 */
export const addItemTypeInstance = (instance: ItemTypeInstance) =>
  ItemTypeInstancesStore.add(instance);

/**
 * Removes an instance by ID.
 *
 * @param id - The ID of the item type instance to unregister.
 */
export const remvoveItemTypeInstance = (id: string) =>
  ItemTypeInstancesStore.remove(id);

/**
 * Retrieves an item type instance by ID or null if it doesn't exist.
 *
 * @param id - The ID of the instance to retrieve.
 * @returns The item type instance or null if it doesn't exist.
 */
export const getItemTypeInstance = (id: string): ItemTypeInstance | null =>
  ItemTypeInstancesStore.get(id) || null;

/**
 * Retrieves an instance by ID or null if it doesn't exist.
 *
 * @param id - The id of the instance to retrieve.
 * @returns The item type instance or null if it doesn't exist.
 */
export const useItemTypeInstance = (id: string): ItemTypeInstance | null =>
  ItemTypeInstancesStore.useAllItems().find(
    (instance) => instance.type === id,
  ) || null;

/**
 * Retrieves all item type instances.
 *
 * @returns And array of all registered item type instances.
 */
export const useItemTypeInstances = (): ItemTypeInstance[] => {
  return ItemTypeInstancesStore.useAllItems();
};
