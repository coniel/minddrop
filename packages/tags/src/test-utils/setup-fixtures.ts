import { MockFileSystem } from '@minddrop/file-system';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { TagGroupsStore } from '../TagGroupsStore';
import { TagsStore } from '../TagsStore';
import { resolveTagGroupsDirPath, resolveTagsDirPath } from '../utils';
import { getTagGroupFiles, tagGroups } from './tag-groups.fixtures';
import { getTagFiles, tags } from './tags.fixtures';

const { workspace_1 } = WorkspaceFixtures;

export interface SetupTagFixturesOptions {
  loadTags?: boolean;
  loadTagFiles?: boolean;
  loadTagGroups?: boolean;
  loadTagGroupFiles?: boolean;
}

export function setupTagFixtures(
  MockFs: MockFileSystem,
  options: SetupTagFixturesOptions = {
    loadTags: true,
    loadTagFiles: true,
    loadTagGroups: true,
    loadTagGroupFiles: true,
  },
) {
  // Create the tags and tag groups directories
  MockFs.createDir(resolveTagsDirPath(workspace_1.path), { recursive: true });
  MockFs.createDir(resolveTagGroupsDirPath(workspace_1.path), {
    recursive: true,
  });

  if (options.loadTags !== false) {
    // Load tags into the store
    TagsStore.load(tags);
  }

  if (options.loadTagFiles !== false) {
    // Load tag files into the mock file system
    MockFs.addFiles(getTagFiles());
  }

  if (options.loadTagGroups !== false) {
    // Load tag groups into the store
    TagGroupsStore.load(tagGroups);
  }

  if (options.loadTagGroupFiles !== false) {
    // Load tag group files into the mock file system
    MockFs.addFiles(getTagGroupFiles());
  }
}

export function cleanupTagFixtures() {
  TagsStore.clear();
  TagGroupsStore.clear();
}
