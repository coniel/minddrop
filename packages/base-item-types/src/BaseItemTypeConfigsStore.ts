import { createArrayStore } from '@minddrop/utils';
import { BaseItemTypeNotFoundError } from './errors';
import { BaseItemTypeConfig } from './types';

export const BaseItemTypeConfigsStore =
  createArrayStore<BaseItemTypeConfig>('type');

/**
 * Registers a BaseItemTypeConfig.
 *
 * @param config - The base item type config to register.
 */
export function register(config: BaseItemTypeConfig): void {
  BaseItemTypeConfigsStore.add(config);
}

/**
 * Unregisters a BaseItemTypeConfig by type.
 *
 * @param type - The type of the base item type config to unregister.
 */
export function unregister(type: string): void {
  BaseItemTypeConfigsStore.remove(type);
}

/**
 * Retrieves a BaseItemTypeConfig by type.
 *
 * @param type - The type of the item type config to retrieve.
 * @returns The item type config.
 *
 * @throws {BaseItemTypeNotFoundError} Thrown if no item type config with the given type exists.
 */
export function get(type: string): BaseItemTypeConfig {
  const config = BaseItemTypeConfigsStore.get(type);

  if (!config) {
    throw new BaseItemTypeNotFoundError(type);
  }

  return config;
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
 * Retrieves a BaseItemTypeConfig by type or null if it doesn't exist.
 *
 * @param type - The type of the item type config to retrieve.
 * @returns The item type config or null if it doesn't exist.
 */
export const useBaseItemTypeConfig = (
  type: string,
): BaseItemTypeConfig | null => {
  return (
    BaseItemTypeConfigsStore.useAllItems().find(
      (config) => config.type === type,
    ) || null
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
