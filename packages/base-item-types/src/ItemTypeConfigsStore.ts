import { createArrayStore } from '@minddrop/utils';
import { BaseItemTypeConfig } from './types';

export const BaseItemTypeConfigsStore =
  createArrayStore<BaseItemTypeConfig>('id');

/**
 * Registers a BaseItemTypeConfig.
 *
 * @param config - The base item type config to register.
 */
export function register(config: BaseItemTypeConfig): void {
  BaseItemTypeConfigsStore.add(config);
}

/**
 * Unregisters a BaseItemTypeConfig by ID.
 *
 * @param id - The ID of the base item type config to unregister.
 */
export function unregister(id: string): void {
  BaseItemTypeConfigsStore.remove(id);
}

/**
 * Retrieves a BaseItemTypeConfig by ID or null if it doesn't exist.
 *
 * @param id - The type of the item type config to retrieve.
 * @returns The item type config or null if it doesn't exist.
 */
export function get(id: string): BaseItemTypeConfig | null {
  const config = BaseItemTypeConfigsStore.get(id);

  return config || null;
}

/**
 * Retrieves all registered BaseItemTypeConfigs.
 *
 * @returns An array of all registered item type configs.
 */
export function getAll(): BaseItemTypeConfig[] {
  return BaseItemTypeConfigsStore.getAll();
}

/**
 * Retrieves a BaseItemTypeConfig by ID or null if it doesn't exist.
 *
 * @param id - The ID of the item type config to retrieve.
 * @returns The item type config or null if it doesn't exist.
 */
export const useBaseItemTypeConfig = (
  id: string,
): BaseItemTypeConfig | null => {
  return (
    BaseItemTypeConfigsStore.useAllItems().find((config) => config.id === id) ||
    null
  );
};

/**
 * Retrieves all item type configs.
 *
 * @returns And array of all registered item type configs.
 */
export const useBaseItemTypeConfigs = (): BaseItemTypeConfig[] => {
  return BaseItemTypeConfigsStore.useAllItems();
};
