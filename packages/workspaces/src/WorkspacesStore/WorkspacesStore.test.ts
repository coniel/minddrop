import { describe, afterEach, it, expect, beforeEach } from 'vitest';
import { workspace1, missingWorkspace, workspaces } from '../test-utils';
import { Workspace } from '../types';
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

  describe('update', () => {
    beforeEach(() => {
      // Load workspaces into the store
      loadWorkspaces();
    });

    it('updates the specified workspace in the store', () => {
      // Update a workspace
      WorkspacesStore.getState().update(workspace1.path, { name: 'New name' });

      // Get the workspace from the store
      const workspace = WorkspacesStore.getState().workspaces.find(
        ({ path }) => path === workspace1.path,
      ) as Workspace;

      // Workspace name should be updated
      expect(workspace).toEqual({ ...workspace1, name: 'New name' });
    });

    it('does nothing if the worksapce does not exist', () => {
      const initialState = [...WorkspacesStore.getState().workspaces];

      // Update a missing workspace
      WorkspacesStore.getState().update('foo', {
        name: 'New name',
      });

      // Workspaces state should remain unchanged
      expect(WorkspacesStore.getState().workspaces).toEqual(initialState);
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
