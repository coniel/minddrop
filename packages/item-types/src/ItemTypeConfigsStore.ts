import { createArrayStore } from '@minddrop/utils';
import { ItemTypeConfig } from './types';

export const ItemTypeConfigsStore =
  createArrayStore<ItemTypeConfig>('nameSingular');

/**
 * Retrieves a ItemTypeConfig by type or null if it doesn't exist.
 *
 * @param type - The type of the item type config to retrieve.
 * @returns The item type config or null if it doesn't exist.
 */
export const useItemTypeConfig = (type: string): ItemTypeConfig | null => {
  return (
    ItemTypeConfigsStore.useAllItems().find(
      (config) => config.nameSingular === type,
    ) || null
  );
};

/**
 * Retrieves all item type configs.
 *
 * @returns And array of all registered item type configs.
 */
export const useItemTypeConfigs = (): ItemTypeConfig[] => {
  return ItemTypeConfigsStore.useAllItems();
};
