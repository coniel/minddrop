import { DesignFixtures, Designs } from '@minddrop/designs';
import { MockFileSystem } from '@minddrop/file-system';
import { PagesStore } from '../PagesStore';
import { getPagesDirPath } from '../utils';
import { pageFiles, pages, pagesDesign } from './pages.fixtures';

const { designs } = DesignFixtures;

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

  // Load designs so page layouts resolve from the layouts store
  Designs.Store.load([...designs, pagesDesign]);

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
  Designs.Store.clear();
}
