import { MockFileSystem } from '@minddrop/file-system';
import { ContentViewTypesRegistry } from '../ContentViewTypesRegistry';
import { ContentViewsStore } from '../ContentViewsStore';
import {
  contentViewFiles,
  contentViewTypes,
  contentViews,
  contentViewsRootPath,
} from './fixtures';

export interface SetupContentViewFixturesOptions {
  loadViewTypes?: boolean;
  loadViews?: boolean;
  loadViewFiles?: boolean;
}

export function setupContentViewFixtures(
  MockFs: MockFileSystem,
  options: SetupContentViewFixturesOptions = {
    loadViewTypes: true,
    loadViews: true,
    loadViewFiles: true,
  },
) {
  // Add the content views directory to the mock file system
  MockFs.createDir(contentViewsRootPath, { recursive: true });

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
}

export function cleanupContentViewFixtures() {
  // Clear stores
  ContentViewsStore.clear();
  ContentViewTypesRegistry.clear();
}
