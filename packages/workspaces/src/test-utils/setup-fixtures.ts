import { MockFileSystem } from '@minddrop/file-system';
import { WorkspacesStore } from '../WorkspacesStore';
import {
  workspaceConfigFile,
  workspaceFiles,
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
