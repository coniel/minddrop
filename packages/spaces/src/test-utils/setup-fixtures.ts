import { Designs } from '@minddrop/designs';
import { EntityGroups } from '@minddrop/entity-groups';
import { MockFileSystem } from '@minddrop/file-system';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { SpaceGroupsTypeConfig } from '../SpaceGroupsTypeConfig';
import { SpacesStore } from '../SpacesStore';
import { SpaceGroupsType } from '../constants';
import { resolveSpacesDirPath } from '../utils';
import { getSpaceGroupFiles, spaceGroups } from './space-groups.fixtures';
import { getSpaceFiles, spaces } from './spaces.fixtures';

const { workspace_1 } = WorkspaceFixtures;

export interface SetupSpaceFixturesOptions {
  loadSpaces?: boolean;
  loadSpaceFiles?: boolean;
  loadSpaceGroups?: boolean;
  loadSpaceGroupFiles?: boolean;
}

export function setupSpaceFixtures(
  MockFs: MockFileSystem,
  options: SetupSpaceFixturesOptions = {
    loadSpaces: true,
    loadSpaceFiles: true,
    loadSpaceGroups: true,
    loadSpaceGroupFiles: true,
  },
) {
  // Create the spaces directory
  MockFs.createDir(resolveSpacesDirPath(workspace_1.path), { recursive: true });

  // Register the space groups type, which the space group functions
  // look up.
  EntityGroups.registerType(SpaceGroupsTypeConfig);

  if (options.loadSpaces !== false) {
    // Load spaces into the store
    SpacesStore.load(spaces);

    // Hydrate the spaces' owned designs into the designs store
    Designs.loadVirtual(
      spaces.map((space) => space.design),
      workspace_1.id,
    );
  }

  if (options.loadSpaceFiles !== false) {
    // Load space files into the mock file system
    MockFs.addFiles(getSpaceFiles());
  }

  if (options.loadSpaceGroups !== false) {
    // Load space groups into the entity groups store
    EntityGroups.Store.load([{ type: SpaceGroupsType, groups: spaceGroups }]);
  }

  if (options.loadSpaceGroupFiles !== false) {
    // Load the space groups file into the mock file system
    MockFs.addFiles(getSpaceGroupFiles());
  }
}

export function cleanupSpaceFixtures() {
  SpacesStore.clear();
  Designs.Store.clear();

  // Drops the type's groups along with the type
  EntityGroups.unregisterType(SpaceGroupsType);
}
