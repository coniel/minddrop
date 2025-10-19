import { createArrayStore } from '@minddrop/utils';
import { ItemTypeConfig } from './types';

export const ItemTypeConfigsStore = createArrayStore<ItemTypeConfig>('type');

/**
 * Registers a ItemTypeConfig.
 *
 * @param config - The collection type config to register.
 */
export function registerItemTypeConfig(config: ItemTypeConfig): void {
  ItemTypeConfigsStore.remove(config.type);
  ItemTypeConfigsStore.add(config);
}

/**
 * Unregisters a ItemTypeConfig by type.
 *
 * @param type - The type of the collection type to unregister.
 */
export function unregisterItemTypeConfig(type: string): void {
  ItemTypeConfigsStore.remove(type);
}

/**
 * Retrieves a ItemTypeConfig by type or null if it doesn't exist.
 *
 * @param type - The type of the type to retrieve.
 * @returns The collection type config or null if it doesn't exist.
 */
export function getItemTypeConfig(type: string): ItemTypeConfig | null {
  const config = ItemTypeConfigsStore.get(type);

  return config || null;
}

/**
 * Retrieves a ItemTypeConfig by type or null if it doesn't exist.
 *
 * @param type - The type of the collection type config to retrieve.
 * @returns The type or null if it doesn't exist.
 */
export const useItemTypeConfig = (type: string): ItemTypeConfig | null => {
  return (
    ItemTypeConfigsStore.useAllItems().find((config) => config.type === type) ||
    null
  );
};

/**
 * Retrieves all ItemTypeConfigs.
 *
 * @returns And array of all registered ItemTypeConfigs.
 */
export const useItemTypeConfigs = (): ItemTypeConfig[] => {
  return ItemTypeConfigsStore.useAllItems();
};
