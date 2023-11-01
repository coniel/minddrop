import { describe, afterEach, it, expect, beforeEach } from 'vitest';
import { workspace1, missingWorkspace, workspaces } from '../test-utils';
import { WorkspacesStore } from './WorkspacesStore';

function loadWorkspaces() {
  WorkspacesStore.getState().load(workspaces);
}

describe('WorkspacesStore', () => {
  afterEach(() => {
    WorkspacesStore.getState().clear();
  });

  describe('load', () => {
    it('loads workspaces into the stor, preserving existing ones', () => {
      // Load a workspace into the store
      WorkspacesStore.getState().load([workspace1]);
      // Load a second workspace into the store
      WorkspacesStore.getState().load([missingWorkspace]);

      // Both workspaces should be in the store
      expect(WorkspacesStore.getState().workspaces).toEqual([
        workspace1,
        missingWorkspace,
      ]);
    });
  });

  describe('add', () => {
    it('adds a workspace to the end of the list', () => {
      // Load a workspace into the store
      WorkspacesStore.getState().load([workspace1]);

      // Add a second workspace to the store
      WorkspacesStore.getState().add(missingWorkspace);

      // Workspace 2 should be added to the end of workspaces
      expect(WorkspacesStore.getState().workspaces).toEqual([
        workspace1,
        missingWorkspace,
      ]);
    });

    it('adds a workspace to the specified index', () => {
      // Load a workspace into the store
      WorkspacesStore.getState().load([workspace1]);

      // Add a second workspace to position 0 in the store
      WorkspacesStore.getState().add(missingWorkspace, 0);

      // Workspace 2 should be added to the start of workspaces
      expect(WorkspacesStore.getState().workspaces).toEqual([
        missingWorkspace,
        workspace1,
      ]);
    });
  });

  describe('remove', () => {
    beforeEach(() => {
      // Load workspaces into the store
      loadWorkspaces();
    });

    it('removes the workspace from the store', () => {
      // Remove a workspace
      WorkspacesStore.getState().remove(workspace1.path);

      // workspace should no longer be in the store
      expect(
        WorkspacesStore.getState().workspaces.find(
          (workspace) => workspace.path === workspace1.path,
        ),
      ).toBeUndefined();
    });
  });
});
