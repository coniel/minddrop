import { describe, afterEach, it, expect, beforeEach } from 'vitest';
import { workspace1, workspace2, workspaces } from '../test-utils';
import { WorkspacesStore } from './WorkspacesStore';

function loadWorkspaces() {
  WorkspacesStore.getState().load(workspaces);
}

describe('WorkspacesStore', () => {
  afterEach(() => {
    WorkspacesStore.getState().clear();
  });

  describe('load', () => {
    it('loads workspaces into the store', () => {
      // Load workspaces into the store
      WorkspacesStore.getState().load(workspaces);

      // workspaces should be in the store
      expect(WorkspacesStore.getState().workspaces).toEqual(workspaces);
    });
  });

  describe('add', () => {
    it('adds a workspace to the end of the list', () => {
      // Load a workspace into the store
      WorkspacesStore.getState().load([workspace1]);

      // Add a second workspace to the store
      WorkspacesStore.getState().add(workspace2);

      // Workspace 2 should be added to the end of workspaces
      expect(WorkspacesStore.getState().workspaces).toEqual([
        workspace1,
        workspace2,
      ]);
    });

    it('adds a workspace to the specified index', () => {
      // Load a workspace into the store
      WorkspacesStore.getState().load([workspace1]);

      // Add a second workspace to position 0 in the store
      WorkspacesStore.getState().add(workspace2, 0);

      // Workspace 2 should be added to the start of workspaces
      expect(WorkspacesStore.getState().workspaces).toEqual([
        workspace2,
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
