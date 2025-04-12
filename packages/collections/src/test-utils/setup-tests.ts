import { CollectionEntriesStore } from '../CollectionEntriesStore';
import { CollectionTypeConfigsStore } from '../CollectionTypeConfigsStore';
import { CollectionsStore } from '../CollectionsStore';
import {
  collectionTypeConfigs,
  collections,
  entries,
} from './collections.data';

interface SetupOptions {
  loadCollections?: boolean;
  loadCollectionTypeConfigs?: boolean;
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
    CollectionTypeConfigsStore.load(collectionTypeConfigs);
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
