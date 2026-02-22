import { MockFileSystem } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
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
  // Clear stores
  WorkspacesStore.clear();
}
