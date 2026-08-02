import { MockFileSystem } from '@minddrop/file-system';
import { DataViewTypesStore } from '../DataViewTypesStore';
import { DataViewsStore } from '../DataViewsStore';
import { viewFiles, viewTypes, views, viewsRootPath } from './fixtures';

export interface SetupViewFixturesOptions {
  loadViewTypes?: boolean;
  loadViews?: boolean;
  loadViewFiles?: boolean;
}

export function setupViewFixtures(
  MockFs: MockFileSystem,
  options: SetupViewFixturesOptions = {
    loadViewTypes: true,
    loadViews: true,
    loadViewFiles: true,
  },
) {
  // Add the data views directory to the mock file system
  MockFs.createDir(viewsRootPath, { recursive: true });

  if (options.loadViewTypes !== false) {
    // Load data view types into the store
    DataViewTypesStore.load(viewTypes);
  }

  if (options.loadViews !== false) {
    // Load data views into the store
    DataViewsStore.load(views);
  }

  if (options.loadViewFiles !== false) {
    // Add data view file to the file system
    MockFs.addFiles(viewFiles);
  }
}

export function cleanupViewFixtures() {
  // Clear stores
  DataViewsStore.clear();
  DataViewTypesStore.clear();
}
