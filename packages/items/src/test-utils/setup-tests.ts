import { initializeMockFileSystem } from '@minddrop/file-system';
import { initializeI18n } from '@minddrop/i18n';
import { ItemTypeConfigsStore, ItemTypesFixtures } from '@minddrop/item-types';
import { ItemTypeConfig } from '@minddrop/item-types';
import { ItemsStore } from '../ItemsStore';
import { items, itemsFileDescriptors } from './fixtures';

initializeI18n();

export const MockFs = initializeMockFileSystem([
  ...itemsFileDescriptors,
  ...ItemTypesFixtures.itemTypeConfigFileDescriptors,
]);

interface SetupOptions {
  loadItemTypeConfigs?: boolean | ItemTypeConfig[];
  loadItems?: boolean;
}
export function setup({
  loadItemTypeConfigs = true,
  loadItems = true,
}: SetupOptions = {}) {
  if (loadItemTypeConfigs !== false) {
    if (Array.isArray(loadItemTypeConfigs)) {
      ItemTypeConfigsStore.load(loadItemTypeConfigs);
    } else {
      ItemTypeConfigsStore.load(ItemTypesFixtures.itemTypeConfigs);
    }
  }

  if (loadItems !== false) {
    ItemsStore.load(items);

    MockFs.addFiles(itemsFileDescriptors);
  }
}

export function cleanup() {
  ItemsStore.clear();
  MockFs.reset();
}
