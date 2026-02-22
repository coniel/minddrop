import { MockFileSystem } from '@minddrop/file-system';
import { ViewTypesStore } from '../ViewTypesStore';
import { ViewsStore } from '../ViewsStore';
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
  // Add the views directory to the mock file system
  MockFs.createDir(viewsRootPath, { recursive: true });

  if (options.loadViewTypes !== false) {
    // Load view types into the store
    ViewTypesStore.load(viewTypes);
  }

  if (options.loadViews !== false) {
    // Load views into the store
    ViewsStore.load(views);
  }

  if (options.loadViewFiles !== false) {
    // Add view file to the file system
    MockFs.addFiles(viewFiles);
  }
}

export function cleanupViewFixtures() {
  // Clear stores
  ViewsStore.clear();
  ViewTypesStore.clear();
}
