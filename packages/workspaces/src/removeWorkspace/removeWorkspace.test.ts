import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Events } from '@minddrop/events';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { WorkspacesStore } from '../WorkspacesStore';
import { getWorkspace } from '../getWorkspace';
import { getWorkspacesConfig } from '../getWorkspacesConfig';
import {
  cleanup,
  setup,
  workspace1,
  workspcesConfigFileDescriptor,
} from '../test-utils';
import { removeWorkspace } from './removeWorkspace';

initializeMockFileSystem([
  // Workspaces config file
  workspcesConfigFileDescriptor,
  // Workspace 1
  workspace1.path,
]);

describe('removeWorkspace', () => {
  beforeEach(() => {
    setup();

    // Add a workspace to the store
    WorkspacesStore.getState().add(workspace1);
  });

  afterEach(cleanup);

  it('removes the workspace from the store', async () => {
    // Remove a workspace
    await removeWorkspace(workspace1.path);

    // Workspace should no longer be in the store
    expect(getWorkspace(workspace1.path)).toBeNull();
  });

  it('removes the workspace from the store', async () => {
    // Remove a workspace
    await removeWorkspace(workspace1.path);

    // Workspace should no longer be in the store
    expect(getWorkspace(workspace1.path)).toBeNull();
  });

  it('updates the workspaces config file', async () => {
    // Remove a workspace
    await removeWorkspace(workspace1.path);

    // Get the workspaces config
    const config = await getWorkspacesConfig();

    // Should remove workspace path from workspaces config
    expect(config.paths.includes(workspace1.path)).toBeFalsy();
  });

  it('dispatches a `workspaces:workspace:remove` event', () =>
    new Promise<void>((done) => {
      // Listen to 'workspaces:workspace:remove' events
      Events.addListener('workspaces:workspace:remove', 'test', (payload) => {
        // Payload data should be the workspace
        expect(payload.data).toEqual(workspace1);
        done();
      });

      // Remove a workspace
      removeWorkspace(workspace1.path);
    }));

  it('does nothing if workspace does not exist', async () => {
    vi.spyOn(WorkspacesStore.getState(), 'remove');

    // Remove a workspace that does not exist
    await removeWorkspace('missing');

    expect(WorkspacesStore.getState().remove).not.toHaveBeenCalled();
  });
});
