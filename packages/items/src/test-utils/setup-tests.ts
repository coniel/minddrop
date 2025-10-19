import { initializeMockFileSystem } from '@minddrop/file-system';
import { initializeI18n } from '@minddrop/i18n';
import { ItemTypeConfigsStore } from '../ItemTypeConfigsStore';
import { ItemTypeInstancesStore } from '../ItemTypeInstancesStore';
import { ItemsStore } from '../ItemsStore';
import { ItemTypeConfig, ItemTypeInstance } from '../types';
import {
  itemTypeConfigs,
  itemTypeInstances,
  itemTypeInstancesFileDescriptors,
  items,
  itemsFileDescriptors,
} from './items.data';

initializeI18n();

export const MockFs = initializeMockFileSystem();

interface SetupOptions {
  loadItemTypeConfigs?: boolean | ItemTypeConfig[];
  loadItemTypeInstances?: boolean | ItemTypeInstance[];
  loadItems?: boolean;
}
export function setup({
  loadItemTypeConfigs = false,
  loadItemTypeInstances = false,
  loadItems = false,
}: SetupOptions = {}) {
  if (loadItemTypeConfigs) {
    if (Array.isArray(loadItemTypeConfigs)) {
      ItemTypeConfigsStore.load(loadItemTypeConfigs);
    } else {
      ItemTypeConfigsStore.load(itemTypeConfigs);
    }
  }

  if (loadItemTypeInstances) {
    if (Array.isArray(loadItemTypeInstances)) {
      ItemTypeInstancesStore.load(loadItemTypeInstances);
    } else {
      ItemTypeInstancesStore.load(itemTypeInstances);
    }

    MockFs.addFiles(itemTypeInstancesFileDescriptors);
  }

  if (loadItems) {
    ItemsStore.load(items);

    MockFs.addFiles(itemsFileDescriptors);
  }
}

export function cleanup() {
  ItemsStore.clear();
  ItemTypeConfigsStore.clear();
  MockFs.reset();
}
