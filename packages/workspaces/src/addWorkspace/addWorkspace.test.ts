import { FileNotFoundError, registerFileSystemAdapter } from '@minddrop/core';
import { MockFsAdapter } from '@minddrop/test-utils';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import * as API from '../writeWorkspacesConfig';
import { setup, cleanup, workspace1, core } from '../test-utils';
import { WorkspacesStore } from '../WorkspacesStore';
import { addWorkspace } from './addWorkspace';

const exists = vi.fn();

// Pretend workspace contains topics
vi.mock('@minddrop/topics', () => ({
  Topics: {
    getFrom: () => [
      { path: workspace1.topics[0] },
      { path: workspace1.topics[1] },
    ],
  },
}));

describe('addWorkspace', () => {
  beforeEach(() => {
    setup();

    // Pretend workspace directory exists
    exists.mockResolvedValue(true);

    registerFileSystemAdapter({
      ...MockFsAdapter,
      exists,
    });
  });

  afterEach(cleanup);

  it('throws if the workspace does not exist', () => {
    // Pretend workspace directory does not exist
    exists.mockResolvedValueOnce(false);

    expect(() => addWorkspace(core, workspace1.path)).rejects.toThrowError(
      FileNotFoundError,
    );
  });

  it('adds the workspace to the store, including topics', async () => {
    // Add a workspace
    await addWorkspace(core, workspace1.path);

    // It should add the workspace to the store
    expect(WorkspacesStore.getState().workspaces[0]).toEqual(workspace1);
  });

  it('persists workspace to workspaces config file', async () => {
    const writeWorkspacesConfig = vi.spyOn(API, 'writeWorkspacesConfig');

    // Add a workspace
    await addWorkspace(core, workspace1.path);

    // It should persist the new workspace
    expect(writeWorkspacesConfig).toHaveBeenCalled();
  });

  it('dispatches a `workspaces:workspace:add` event', async () =>
    new Promise<void>((done) => {
      // Listen to 'workspaces:workspace:add' events
      core.addEventListener('workspaces:workspace:add', (payload) => {
        // Payload data should be the workspace
        expect(payload.data).toEqual(workspace1);
        done();
      });

      // Add a workspace
      addWorkspace(core, workspace1.path);
    }));

  it('returns the new workspace', async () => {
    // Add a workspace
    const workspace = await addWorkspace(core, workspace1.path);

    // Should return a workspace object
    expect(workspace).toEqual(workspace1);
  });
});
