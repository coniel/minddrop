import { EntityGroups } from '@minddrop/entity-groups';
import { MockFileSystem } from '@minddrop/file-system';
import { ContentViewGroupsTypeConfig } from '../ContentViewGroupsTypeConfig';
import { ContentViewTypesRegistry } from '../ContentViewTypesRegistry';
import { ContentViewsStore } from '../ContentViewsStore';
import { ContentViewGroupsType } from '../constants';
import {
  contentViewFiles,
  contentViewGroupFiles,
  contentViewGroups,
  contentViewTypes,
  contentViews,
  contentViewsRootPath,
} from './fixtures';

export interface SetupContentViewFixturesOptions {
  loadViewTypes?: boolean;
  loadViews?: boolean;
  loadViewFiles?: boolean;
  loadViewGroups?: boolean;
  loadViewGroupFiles?: boolean;
}

export function setupContentViewFixtures(
  MockFs: MockFileSystem,
  options: SetupContentViewFixturesOptions = {
    loadViewTypes: true,
    loadViews: true,
    loadViewFiles: true,
    loadViewGroups: true,
    loadViewGroupFiles: true,
  },
) {
  // Add the content views directory to the mock file system
  MockFs.createDir(contentViewsRootPath, { recursive: true });

  // Register the content view groups type, which the content view
  // group functions look up.
  EntityGroups.registerType(ContentViewGroupsTypeConfig);

  if (options.loadViewTypes !== false) {
    // Load content view types into the registry
    ContentViewTypesRegistry.store.load(contentViewTypes);
  }

  if (options.loadViews !== false) {
    // Load content views into the store
    ContentViewsStore.load(contentViews);
  }

  if (options.loadViewFiles !== false) {
    // Add content view file to the file system
    MockFs.addFiles(contentViewFiles);
  }

  if (options.loadViewGroups !== false) {
    // Load content view groups into the entity groups store
    EntityGroups.Store.load([
      { type: ContentViewGroupsType, groups: contentViewGroups },
    ]);
  }

  if (options.loadViewGroupFiles !== false) {
    // Add the content view groups file to the file system
    MockFs.addFiles(contentViewGroupFiles);
  }
}

export function cleanupContentViewFixtures() {
  // Clear stores
  ContentViewsStore.clear();
  ContentViewTypesRegistry.clear();

  // Drops the type's groups along with the type
  EntityGroups.unregisterType(ContentViewGroupsType);
}
