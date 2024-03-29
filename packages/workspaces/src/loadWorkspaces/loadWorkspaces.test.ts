import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { MockFsAdapter } from '@minddrop/test-utils';
import { registerFileSystemAdapter } from '@minddrop/core';
import {
  setup,
  cleanup,
  missingWorkspace,
  workspace1,
  workspace1Config,
} from '../test-utils';
import { WorkspacesStore } from '../WorkspacesStore';
import * as GET_WORKSPACE_FROM_PATH from '../getWorkspaceFromPath';
import { loadWorkspaces } from './loadWorkspaces';
import { Events } from '@minddrop/events';

const workspacesConfigFileContens = JSON.stringify({
  paths: [workspace1.path, missingWorkspace.path],
});

const exists = vi.fn();
const readTextFile = vi.fn();
const readDir = vi.fn();

describe('loadWorkspaces', () => {
  beforeEach(() => {
    setup();

    readTextFile.mockResolvedValue(workspacesConfigFileContens);
    // Pretend that workspace 2 does not exist
    exists.mockImplementation(
      (path: string) =>
        new Promise((resolve) => resolve(path !== missingWorkspace.path)),
    );

    // Return the appropriate workspace when getting from path
    vi.spyOn(
      GET_WORKSPACE_FROM_PATH,
      'getWorkspaceFromPath',
    ).mockImplementation(async (path) => {
      switch (path) {
        case workspace1.path:
          return workspace1;
        case missingWorkspace.path:
          return missingWorkspace;
        default:
          throw new Error(`unexpected workspace path ${path}`);
      }
    });

    registerFileSystemAdapter({
      ...MockFsAdapter,
      exists,
      readTextFile,
      readDir,
    });
  });

  afterEach(cleanup);

  it('throws if the workspaces config could not be read', () => {
    // Pretend workspaces file does not exist
    exists.mockResolvedValueOnce(false);

    expect(() => loadWorkspaces()).rejects.toThrow();
  });

  it('loads workspaces into the store', async () => {
    // Load the workspaces
    await loadWorkspaces();

    // Store should contain the workspaces
    expect(WorkspacesStore.getState().workspaces).toEqual([
      workspace1,
      missingWorkspace,
    ]);
  });

  it('does not load workspaces already present in the store', async () => {
    // Add a workspace to the store
    WorkspacesStore.getState().add(workspace1);

    // Load the workspaces
    await loadWorkspaces();

    // Store should contain the workspaces
    expect(WorkspacesStore.getState().workspaces).toEqual([
      workspace1,
      missingWorkspace,
    ]);
  });

  it('dispatches a `workspaces:load` event', async () =>
    new Promise<void>((done) => {
      // Listen to 'workspaces:load' events
      Events.addListener('workspaces:load', 'test', (payload) => {
        // Payload data should be the workspaces
        expect(payload.data).toEqual([workspace1, missingWorkspace]);
        done();
      });

      // Load workspaces
      loadWorkspaces();
    }));

  it('does not dispatch if no new workspaces were loaded', async () => {
    const dispatch = vi.spyOn(Events, 'dispatch');

    // Load workspaces
    await loadWorkspaces();

    dispatch.mockClear();

    // Load workspaces again, nothing new will
    // be loaded.
    await loadWorkspaces();

    // Should not dispatch
    expect(dispatch).not.toHaveBeenCalled();
  });
});
