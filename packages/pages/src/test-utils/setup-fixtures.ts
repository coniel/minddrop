import { MockFileSystem } from '@minddrop/file-system';
import { PagesStore } from '../PagesStore';
import { getPagesDirPath } from '../utils';
import { pageFiles, pages } from './pages.fixtures';

export interface SetupPageFixturesOptions {
  loadPages?: boolean;
  loadPageFiles?: boolean;
}

export function setupPageFixtures(
  MockFs: MockFileSystem,
  options: SetupPageFixturesOptions = {
    loadPages: true,
    loadPageFiles: true,
  },
) {
  // Create the pages directory
  MockFs.createDir(getPagesDirPath(), { recursive: true });

  if (options.loadPages !== false) {
    // Load pages into the store
    PagesStore.load(pages);
  }

  if (options.loadPageFiles !== false) {
    // Load page files into the mock file system
    MockFs.addFiles(pageFiles);
  }
}

export function cleanupPageFixtures() {
  PagesStore.clear();
}
