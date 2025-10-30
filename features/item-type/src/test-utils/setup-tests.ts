import { BaseItemTypes, BaseItemTypesConfigs } from '@minddrop/base-item-types';
import { Events } from '@minddrop/events';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { ItemTypes, ItemTypesFixtures } from '@minddrop/item-types';
import { cleanup as uiCleanup } from '@minddrop/test-utils';

const { itemTypeConfigFileDescriptors, itemTypeConfigs } = ItemTypesFixtures;

interface SetupOptions {
  loadItemTypes?: boolean;
}

export const MockFs = initializeMockFileSystem([
  ...itemTypeConfigFileDescriptors,
]);

export function setup(options: SetupOptions = { loadItemTypes: true }) {
  // Register base item types
  BaseItemTypesConfigs.forEach((itemTypeConfig) => {
    BaseItemTypes.register(itemTypeConfig);
  });

  if (options.loadItemTypes !== false) {
    // Load item type configs into the store
    ItemTypes.Store.load(itemTypeConfigs);
  }
}

export function cleanup() {
  uiCleanup();
  Events._clearAll();

  // Unregister all base item types
  BaseItemTypesConfigs.forEach((itemTypeConfig) => {
    BaseItemTypes.unregister(itemTypeConfig.type);
  });

  // Clear the ItemTypeConfigsStore
  ItemTypes.Store.clear();

  // Reset mock file system
  MockFs.reset();
}
