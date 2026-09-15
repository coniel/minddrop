import { ContentViewTypes } from '@minddrop/content-views';
import { contentViewTypes } from '@minddrop/content-views/test-utils';
import { MockFileSystem } from '@minddrop/file-system';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { DesignRolesStore } from '../DesignRolesStore';
import { DesignsStore } from '../DesignsStore';
import { BuiltInDesignRoles } from '../roles';
import { resolveDesignsDirPath } from '../utils';
import { designs, getDesignFiles } from './fixtures';

const { workspace_1 } = WorkspaceFixtures;

export interface SetupDesignFixturesOptions {
  loadDesigns?: boolean;
  loadDesignFiles?: boolean;
  loadRoles?: boolean;
}

export function setupDesignFixtures(
  MockFs: MockFileSystem,
  options: SetupDesignFixturesOptions = {},
) {
  // Create the designs directory
  MockFs.createDir(resolveDesignsDirPath(workspace_1.path), {
    recursive: true,
  });

  if (options.loadDesigns !== false) {
    // Load designs into the store
    DesignsStore.load(designs);
  }

  if (options.loadDesignFiles !== false) {
    // Add design files to the file system
    MockFs.addFiles(getDesignFiles());
  }

  if (options.loadRoles !== false) {
    // Load the built-in roles into the registry
    DesignRolesStore.load(BuiltInDesignRoles);
  }

  // Load the content view types the collection element's variants
  // derive from.
  ContentViewTypes.Store.load(contentViewTypes);
}

export function cleanupDesignFixtures() {
  // Clear the designs store
  DesignsStore.clear();

  // Clear the role registry
  DesignRolesStore.clear();

  // Clear the content view type registry
  ContentViewTypes.Store.clear();
}
