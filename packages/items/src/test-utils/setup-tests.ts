import { initializeI18n } from '@minddrop/i18n';
import { ItemTypeConfigsStore } from '../ItemTypeConfigsStore';
import { ItemsStore } from '../ItemsStore';
import { ItemTypeConfig } from '../types';
import { itemTypeConfigs, items } from './items.data';

initializeI18n();

interface SetupOptions {
  loadItems?: boolean;
  loadItemTypeConfigs?: boolean | ItemTypeConfig[];
}
export function setup({
  loadItems = false,
  loadItemTypeConfigs = false,
}: SetupOptions = {}) {
  if (loadItems) {
    ItemsStore.load(items);
  }

  if (loadItemTypeConfigs) {
    if (Array.isArray(loadItemTypeConfigs)) {
      ItemTypeConfigsStore.load(loadItemTypeConfigs);
    } else {
      ItemTypeConfigsStore.load(itemTypeConfigs);
    }
  }
}

export function cleanup() {
  ItemsStore.clear();
  ItemTypeConfigsStore.clear();
}
