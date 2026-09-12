import { MockFileSystem } from '@minddrop/file-system';
import { ItemReferences } from '@minddrop/item-references';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { CollectionsStore } from '../CollectionsStore';
import { resolveCollectionsDirPath } from '../utils';
import {
  collections,
  collections_virtual,
  getCollectionFiles,
} from './collections.fixtures';

const { workspace_1 } = WorkspaceFixtures;

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
  MockFs.createDir(resolveCollectionsDirPath(workspace_1.path), {
    recursive: true,
  });

  if (options.loadCollections !== false) {
    // Load collections into the store
    CollectionsStore.load(collections);
  }

  if (options.loadCollectionFiles !== false) {
    // Load collection files into the mock file system
    MockFs.addFiles(getCollectionFiles());
  }

  if (options.loadVirtualCollections !== false) {
    // Load virtual collections into the store
    CollectionsStore.load(collections_virtual);
  }
}

export function cleanupCollectionFixtures() {
  CollectionsStore.clear();
  ItemReferences.unregisterAdapter('database-entry');
}
