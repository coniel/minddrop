import { FileNotFoundError, registerFileSystemAdapter } from '@minddrop/core';
import { MockFsAdapter } from '@minddrop/test-utils';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import * as API from '../writeWorkspacesConfig';
import { setup, cleanup, workspace1 } from '../test-utils';
import { WorkspacesStore } from '../WorkspacesStore';
import { addWorkspace } from './addWorkspace';
import { Events } from '@minddrop/events';

const exists = vi.fn();

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

    expect(() => addWorkspace(workspace1.path)).rejects.toThrowError(
      FileNotFoundError,
    );
  });

  it('adds the workspace to the store', async () => {
    // Add a workspace
    await addWorkspace(workspace1.path);

    // It should add the workspace to the store
    expect(WorkspacesStore.getState().workspaces[0]).toEqual(workspace1);
  });

  it('persists workspace to workspaces config file', async () => {
    const writeWorkspacesConfig = vi.spyOn(API, 'writeWorkspacesConfig');

    // Add a workspace
    await addWorkspace(workspace1.path);

    // It should persist the new workspace
    expect(writeWorkspacesConfig).toHaveBeenCalled();
  });

  it('dispatches a `workspaces:workspace:add` event', async () =>
    new Promise<void>((done) => {
      // Listen to 'workspaces:workspace:add' events
      Events.addListener('workspaces:workspace:add', 'test', (payload) => {
        // Payload data should be the workspace
        expect(payload.data).toEqual(workspace1);
        done();
      });

      // Add a workspace
      addWorkspace(workspace1.path);
    }));

  it('returns the new workspace', async () => {
    // Add a workspace
    const workspace = await addWorkspace(workspace1.path);

    // Should return a workspace object
    expect(workspace).toEqual(workspace1);
  });
});
