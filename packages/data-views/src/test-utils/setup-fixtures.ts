import { MockFileSystem } from '@minddrop/file-system';
import { DataViewTypesStore } from '../DataViewTypesStore';
import { DataViewsStore } from '../DataViewsStore';
import {
  dataViewFiles,
  dataViewTypes,
  dataViews,
  dataViewsRootPath,
} from './fixtures';

export interface SetupDataViewFixturesOptions {
  loadViewTypes?: boolean;
  loadViews?: boolean;
  loadViewFiles?: boolean;
}

export function setupDataViewFixtures(
  MockFs: MockFileSystem,
  options: SetupDataViewFixturesOptions = {
    loadViewTypes: true,
    loadViews: true,
    loadViewFiles: true,
  },
) {
  // Add the data views directory to the mock file system
  MockFs.createDir(dataViewsRootPath, { recursive: true });

  if (options.loadViewTypes !== false) {
    // Load data view types into the store
    DataViewTypesStore.load(dataViewTypes);
  }

  if (options.loadViews !== false) {
    // Load data views into the store
    DataViewsStore.load(dataViews);
  }

  if (options.loadViewFiles !== false) {
    // Add data view file to the file system
    MockFs.addFiles(dataViewFiles);
  }
}

export function cleanupDataViewFixtures() {
  // Clear stores
  DataViewsStore.clear();
  DataViewTypesStore.clear();
}
