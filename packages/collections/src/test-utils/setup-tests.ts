import { initializeI18n } from '@minddrop/i18n';
import { CollectionEntriesStore } from '../CollectionEntriesStore';
import { CollectionTypeConfigsStore } from '../CollectionTypeConfigsStore';
import { CollectionsStore } from '../CollectionsStore';
import { CollectionTypeConfig } from '../types';
import {
  collectionTypeConfigs,
  collections,
  entries,
} from './collections.data';

initializeI18n();

interface SetupOptions {
  loadCollections?: boolean;
  loadCollectionTypeConfigs?: boolean | CollectionTypeConfig[];
  loadCollectionEntries?: boolean;
}
export function setup({
  loadCollections = false,
  loadCollectionTypeConfigs = false,
  loadCollectionEntries = false,
}: SetupOptions = {}) {
  if (loadCollections) {
    CollectionsStore.getState().load(collections);
  }

  if (loadCollectionTypeConfigs) {
    if (Array.isArray(loadCollectionTypeConfigs)) {
      CollectionTypeConfigsStore.load(loadCollectionTypeConfigs);
    } else {
      CollectionTypeConfigsStore.load(collectionTypeConfigs);
    }
  }

  if (loadCollectionEntries) {
    CollectionEntriesStore.load(entries);
  }
}

export function cleanup() {
  CollectionsStore.getState().clear();
  CollectionTypeConfigsStore.clear();
  CollectionEntriesStore.clear();
}
