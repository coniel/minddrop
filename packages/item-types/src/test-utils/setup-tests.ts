import {
  BaseItemTypes,
  BaseItemTypesFixtures,
} from '@minddrop/base-item-types';
import { BaseDirectory, initializeMockFileSystem } from '@minddrop/file-system';
import { initializeI18n } from '@minddrop/i18n';
import { ItemTypeConfigsStore } from '../ItemTypeConfigsStore';
import { itemTypeConfigFileDescriptors, itemTypeConfigs } from './fixtures';

interface SetupOptions {
  loadItemTypes?: boolean;
}

initializeI18n();

export const MockFs = initializeMockFileSystem([
  ...itemTypeConfigFileDescriptors,
]);

export function setup(options: SetupOptions = { loadItemTypes: true }) {
  // Register base item types
  BaseItemTypesFixtures.baseItemTypes.forEach((itemTypeConfig) => {
    BaseItemTypes.register(itemTypeConfig);
  });

  if (options.loadItemTypes !== false) {
    // Load item type configs into the store
    ItemTypeConfigsStore.load(itemTypeConfigs);
  }
}

export function cleanup() {
  // Unregister all base item types
  BaseItemTypesFixtures.baseItemTypes.forEach((itemTypeConfig) => {
    BaseItemTypes.unregister(itemTypeConfig.type);
  });

  // Clear the ItemTypeConfigsStore
  ItemTypeConfigsStore.clear();

  // Reset mock file system
  MockFs.reset();
}
