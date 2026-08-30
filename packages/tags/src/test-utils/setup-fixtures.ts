import { MockFileSystem } from '@minddrop/file-system';
import { TagsStore } from '../TagsStore';
import { resolveTagsDirPath } from '../utils';
import { getTagFiles, tags } from './tags.fixtures';

export interface SetupTagFixturesOptions {
  loadTags?: boolean;
  loadTagFiles?: boolean;
}

export function setupTagFixtures(
  MockFs: MockFileSystem,
  options: SetupTagFixturesOptions = {
    loadTags: true,
    loadTagFiles: true,
  },
) {
  // Create the tags directory
  MockFs.createDir(resolveTagsDirPath(), { recursive: true });

  if (options.loadTags !== false) {
    // Load tags into the store
    TagsStore.load(tags);
  }

  if (options.loadTagFiles !== false) {
    // Load tag files into the mock file system
    MockFs.addFiles(getTagFiles());
  }
}

export function cleanupTagFixtures() {
  TagsStore.clear();
}
