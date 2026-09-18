import { EntityGroups } from '@minddrop/entity-groups';
import { MockFileSystem } from '@minddrop/file-system';
import { ItemReferences } from '@minddrop/item-references';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { CollectionGroupsTypeConfig } from '../CollectionGroupsTypeConfig';
import { CollectionsStore } from '../CollectionsStore';
import { CollectionGroupsType } from '../constants';
import { resolveCollectionsDirPath } from '../utils';
import {
  collectionGroups,
  getCollectionGroupFiles,
} from './collection-groups.fixtures';
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
  loadCollectionGroups?: boolean;
  loadCollectionGroupFiles?: boolean;
}

export function setupCollectionFixtures(
  MockFs: MockFileSystem,
  options: SetupCollectionFixturesOptions = {
    loadCollections: true,
    loadCollectionFiles: true,
    loadVirtualCollections: true,
    loadCollectionGroups: true,
    loadCollectionGroupFiles: true,
  },
) {
  // Create the collections directory
  MockFs.createDir(resolveCollectionsDirPath(workspace_1.path), {
    recursive: true,
  });

  // Register the collection groups type, which the collection group
  // functions look up.
  EntityGroups.registerType(CollectionGroupsTypeConfig);

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

  if (options.loadCollectionGroups !== false) {
    // Load collection groups into the entity groups store
    EntityGroups.Store.load([
      { type: CollectionGroupsType, groups: collectionGroups },
    ]);
  }

  if (options.loadCollectionGroupFiles !== false) {
    // Load the collection groups file into the mock file system
    MockFs.addFiles(getCollectionGroupFiles());
  }
}

export function cleanupCollectionFixtures() {
  CollectionsStore.clear();
  ItemReferences.unregisterAdapter('database-entry');

  // Drops the type's groups along with the type
  EntityGroups.unregisterType(CollectionGroupsType);
}
