import { createObjectStore } from '@minddrop/stores';
import { DesignElementConfig } from './types';

export const DesignElementConfigsStore = createObjectStore<DesignElementConfig>(
  'DesignsNext:DesignElementConfigs',
  'type',
);

/**
 * Retrieves a design element type's config by its type.
 *
 * @param type - The design element type to retrieve the config for.
 * @returns The design element type config or null if it is not registered.
 */
export const useDesignElementConfig = (
  type: string,
): DesignElementConfig | null => {
  return DesignElementConfigsStore.useItem(type);
};

/**
 * Retrieves all registered design element type configs.
 *
 * @returns An array of the registered design element type configs.
 */
export const useDesignElementConfigs = (): DesignElementConfig[] => {
  return DesignElementConfigsStore.useAllItemsArray();
};
