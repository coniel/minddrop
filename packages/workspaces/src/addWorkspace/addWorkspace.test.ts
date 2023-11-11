import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { MockFsAdapter } from '@minddrop/test-utils';
import { FileNotFoundError, registerFileSystemAdapter } from '@minddrop/core';
import { Events } from '@minddrop/events';
import * as API from '../writeWorkspacesConfig';
import { setup, cleanup, newWorkspace } from '../test-utils';
import { WorkspacesStore } from '../WorkspacesStore';
import { addWorkspace } from './addWorkspace';
import * as GET_WORKSPACE_FROM_PATH from '../getWorkspaceFromPath';

const exists = vi.fn();

describe('addWorkspace', () => {
  beforeEach(() => {
    setup();

    // Pretend workspace directory exists
    exists.mockResolvedValue(true);
    // Return newWorkspace when getting workspace from path
    vi.spyOn(GET_WORKSPACE_FROM_PATH, 'getWorkspaceFromPath').mockResolvedValue(
      newWorkspace,
    );

    registerFileSystemAdapter({
      ...MockFsAdapter,
      exists,
    });
  });

  afterEach(cleanup);

  it('throws if the workspace does not exist', () => {
    // Pretend workspace directory does not exist
    exists.mockResolvedValueOnce(false);

    expect(() => addWorkspace(newWorkspace.path)).rejects.toThrowError(
      FileNotFoundError,
    );
  });

  it('adds the workspace to the store', async () => {
    // Add a workspace
    await addWorkspace(newWorkspace.path);

    // It should add the workspace to the store
    expect(WorkspacesStore.getState().workspaces[0]).toEqual(newWorkspace);
  });

  it('persists workspace to workspaces config file', async () => {
    const writeWorkspacesConfig = vi.spyOn(API, 'writeWorkspacesConfig');

    // Add a workspace
    await addWorkspace(newWorkspace.path);

    // It should persist the new workspace
    expect(writeWorkspacesConfig).toHaveBeenCalled();
  });

  it('dispatches a `workspaces:workspace:add` event', async () =>
    new Promise<void>((done) => {
      // Listen to 'workspaces:workspace:add' events
      Events.addListener('workspaces:workspace:add', 'test', (payload) => {
        // Payload data should be the workspace
        expect(payload.data).toEqual(newWorkspace);
        done();
      });

      // Add a workspace
      addWorkspace(newWorkspace.path);
    }));

  it('returns the new workspace', async () => {
    // Add a workspace
    const workspace = await addWorkspace(newWorkspace.path);

    // Should return a workspace object
    expect(workspace).toEqual(newWorkspace);
  });
});
