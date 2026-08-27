import { Designs } from '@minddrop/designs';
import { MockFileSystem } from '@minddrop/file-system';
import { SpacesStore } from '../SpacesStore';
import { resolveSpacesDirPath } from '../utils';
import { getSpaceFiles, spaces } from './spaces.fixtures';

export interface SetupSpaceFixturesOptions {
  loadSpaces?: boolean;
  loadSpaceFiles?: boolean;
}

export function setupSpaceFixtures(
  MockFs: MockFileSystem,
  options: SetupSpaceFixturesOptions = {
    loadSpaces: true,
    loadSpaceFiles: true,
  },
) {
  // Create the spaces directory
  MockFs.createDir(resolveSpacesDirPath(), { recursive: true });

  if (options.loadSpaces !== false) {
    // Load spaces into the store
    SpacesStore.load(spaces);

    // Hydrate the spaces' owned designs into the designs store
    Designs.loadVirtual(spaces.map((space) => space.design));
  }

  if (options.loadSpaceFiles !== false) {
    // Load space files into the mock file system
    MockFs.addFiles(getSpaceFiles());
  }
}

export function cleanupSpaceFixtures() {
  SpacesStore.clear();
  Designs.Store.clear();
}
