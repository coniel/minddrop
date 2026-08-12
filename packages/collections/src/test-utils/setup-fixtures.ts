import { MockFileSystem } from '@minddrop/file-system';
import { unregisterItemReferenceAdapter } from '@minddrop/item-references';
import { CollectionsStore } from '../CollectionsStore';
import { resolveCollectionsDirPath } from '../utils';
import {
  collectionFiles,
  collections,
  collections_virtual,
} from './collections.fixtures';

export interface SetupCollectionFixturesOptions {
  loadCollections?: boolean;
  loadCollectionFiles?: boolean;
  loadVirtualCollections?: boolean;
}

export function setupCollectionFixtures(
  MockFs: MockFileSystem,
  options: SetupCollectionFixturesOptions = {
    loadCollections: true,
    loadCollectionFiles: true,
    loadVirtualCollections: true,
  },
) {
  // Create the collections directory
  MockFs.createDir(resolveCollectionsDirPath(), { recursive: true });

  if (options.loadCollections !== false) {
    // Load collections into the store
    CollectionsStore.load(collections);
  }

  if (options.loadCollectionFiles !== false) {
    // Load collection files into the mock file system
    MockFs.addFiles(collectionFiles);
  }

  if (options.loadVirtualCollections !== false) {
    // Load virtual collections into the store
    CollectionsStore.load(collections_virtual);
  }
}

export function cleanupCollectionFixtures() {
  CollectionsStore.clear();
  unregisterItemReferenceAdapter('database-entry');
}
