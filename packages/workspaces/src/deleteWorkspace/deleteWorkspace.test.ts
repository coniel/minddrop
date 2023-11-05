import { Fs, registerFileSystemAdapter } from '@minddrop/core';
import { Events } from '@minddrop/events';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { MockFsAdapter } from '@minddrop/test-utils';
import * as WRITE_CONFIG from '../writeWorkspacesConfig';
import { getWorkspace } from '../getWorkspace';
import { setup, cleanup, workspace1 } from '../test-utils';
import { WorkspacesStore } from '../WorkspacesStore';
import { deleteWorkspace } from './deleteWorkspace';

registerFileSystemAdapter(MockFsAdapter);

describe('deleteWorkspace', () => {
  beforeEach(setup);

  afterEach(cleanup);

  beforeEach(() => {
    setup();

    vi.spyOn(Fs, 'trashDir').mockResolvedValue();

    // Add a workspace to the store
    WorkspacesStore.getState().add(workspace1);
  });

  afterEach(cleanup);

  it('removes the workspace from the store', async () => {
    // Remove a workspace
    await deleteWorkspace(workspace1.path);

    // Workspace should no longer be in the store
    expect(getWorkspace(workspace1.path)).toBeNull();
  });

  it('deletes the workspace folder', async () => {
    // Remove a workspace
    await deleteWorkspace(workspace1.path);

    // Should delete the workspace folder
    expect(Fs.trashDir).toHaveBeenCalledWith(workspace1.path);
  });

  it('updates the workspaces config file', async () => {
    vi.spyOn(WRITE_CONFIG, 'writeWorkspacesConfig').mockResolvedValue();

    // Delete a workspace
    await deleteWorkspace(workspace1.path);

    // Should write updated workspace path to config
    expect(WRITE_CONFIG.writeWorkspacesConfig).toHaveBeenCalled();
  });

  it('dispatches a `workspaces:workspace:delete` event', () =>
    new Promise<void>((done) => {
      // Listen to 'workspaces:workspace:delete' events
      Events.addListener('workspaces:workspace:delete', 'test', (payload) => {
        // Payload data should be the workspace
        expect(payload.data).toEqual(workspace1);
        done();
      });

      // Remove a workspace
      deleteWorkspace(workspace1.path);
    }));

  it('does nothing if workspace does not exist', async () => {
    vi.spyOn(WorkspacesStore.getState(), 'remove');

    // Remove a workspace that does not exist
    await deleteWorkspace('missing');

    expect(WorkspacesStore.getState().remove).not.toHaveBeenCalled();
  });
});
