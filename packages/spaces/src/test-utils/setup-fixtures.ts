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
  }

  if (options.loadSpaceFiles !== false) {
    // Load space files into the mock file system
    MockFs.addFiles(getSpaceFiles());
  }
}

export function cleanupSpaceFixtures() {
  SpacesStore.clear();
}
