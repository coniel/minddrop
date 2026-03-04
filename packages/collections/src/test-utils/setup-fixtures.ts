import { MockFileSystem } from '@minddrop/file-system';
import { CollectionsStore } from '../CollectionsStore';
import { getCollectionsDirPath } from '../utils';
import { collectionFiles, collections } from './collections.fixtures';

export interface SetupCollectionFixturesOptions {
  loadCollections?: boolean;
  loadCollectionFiles?: boolean;
}

export function setupCollectionFixtures(
  MockFs: MockFileSystem,
  options: SetupCollectionFixturesOptions = {
    loadCollections: true,
    loadCollectionFiles: true,
  },
) {
  // Create the collections directory
  MockFs.createDir(getCollectionsDirPath(), { recursive: true });

  if (options.loadCollections !== false) {
    // Load collections into the store
    CollectionsStore.load(collections);
  }

  if (options.loadCollectionFiles !== false) {
    // Load collection files into the mock file system
    MockFs.addFiles(collectionFiles);
  }
}

export function cleanupCollectionFixtures() {
  CollectionsStore.clear();
}
