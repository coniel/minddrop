import { MockFileSystem } from '@minddrop/file-system';
import {
  dropWorkspaceRecords,
  setActiveWorkspaceScope,
} from '@minddrop/stores';
import { Paths } from '@minddrop/utils';
import { ActiveWorkspaceStore } from '../ActiveWorkspaceStore';
import { WorkspacesStore } from '../WorkspacesStore';
import {
  workspaceConfigFile,
  workspaceFiles,
  workspace_1,
  workspaces,
} from './workspaces.fixtures';

export interface SetupWorkspaceFixturesOptions {
  loadWorkspaces?: boolean;
  loadWorkspaceFiles?: boolean;
  loadWorkspacesConfig?: boolean;
}

export function setupWorkspaceFixtures(
  MockFs: MockFileSystem,
  options: SetupWorkspaceFixturesOptions = {
    loadWorkspaces: true,
    loadWorkspaceFiles: true,
  },
) {
  // Set workspace_1 as the current workspace
  Paths.workspace = workspace_1.path;

  if (options.loadWorkspaces !== false) {
    // Load workspaces into the store
    WorkspacesStore.load(workspaces);

    // Set workspace_1 as the active workspace
    ActiveWorkspaceStore.set('id', workspace_1.id);
    setActiveWorkspaceScope(workspace_1.id);
  }

  if (options.loadWorkspaceFiles !== false) {
    // Add workspace file to the file system
    MockFs.addFiles(workspaceFiles);
  }

  if (options.loadWorkspacesConfig !== false) {
    // Add workspaces config to the file system
    MockFs.addFiles([workspaceConfigFile]);
  }
}

export function cleanupWorkspaceFixtures() {
  // Drop whatever the tests put into the fixture workspaces' records,
  // which a store's own clear() leaves in place for every workspace
  // but the active one.
  workspaces.forEach((workspace) => dropWorkspaceRecords(workspace.id));

  // Clear stores
  WorkspacesStore.clear();
  ActiveWorkspaceStore.reset();
  setActiveWorkspaceScope(null);
}
