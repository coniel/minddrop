import { EntityGroups } from '@minddrop/entity-groups';
import { MockFileSystem } from '@minddrop/file-system';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { TagsStore } from '../TagsStore';
import { TagGroupsType } from '../constants';
import { tagGroupsTypeConfig } from '../tagGroupsTypeConfig';
import { resolveTagsDirPath } from '../utils';
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
  // Create the tags directory
  MockFs.createDir(resolveTagsDirPath(workspace_1.path), { recursive: true });

  // Register the tag groups type, which the tag group functions
  // look up.
  EntityGroups.registerType(tagGroupsTypeConfig);

  if (options.loadTags !== false) {
    // Load tags into the store
    TagsStore.load(tags);
  }

  if (options.loadTagFiles !== false) {
    // Load tag files into the mock file system
    MockFs.addFiles(getTagFiles());
  }

  if (options.loadTagGroups !== false) {
    // Load tag groups into the entity groups store
    EntityGroups.Store.load([{ type: TagGroupsType, groups: tagGroups }]);
  }

  if (options.loadTagGroupFiles !== false) {
    // Load the tag groups file into the mock file system
    MockFs.addFiles(getTagGroupFiles());
  }
}

export function cleanupTagFixtures() {
  TagsStore.clear();

  // Drops the type's groups along with the type
  EntityGroups.unregisterType(TagGroupsType);
}
