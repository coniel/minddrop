import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { Events } from '@minddrop/events';
import { getWorkspace } from '../getWorkspace';
import {
  setup,
  cleanup,
  workspace1,
  workspace1ConfigPath,
  workspcesConfigFileDescriptor,
} from '../test-utils';
import { WorkspacesStore } from '../WorkspacesStore';
import { deleteWorkspace } from './deleteWorkspace';
import { getWorkspacesConfig } from '../getWorkspacesConfig';

const MockFs = initializeMockFileSystem([
  // Workspaces config file
  workspcesConfigFileDescriptor,
  // Workspace 1 config file
  workspace1ConfigPath,
]);

describe('deleteWorkspace', () => {
  beforeEach(setup);

  afterEach(cleanup);

  beforeEach(() => {
    setup();

    // Add a workspace to the store
    WorkspacesStore.getState().add(workspace1);

    // Reset mock file system
    MockFs.reset();
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
    expect(MockFs.existsInTrash(workspace1.path)).toBeTruthy();
  });

  it('removes workspace path from workspaces config', async () => {
    // Delete a workspace
    await deleteWorkspace(workspace1.path);

    // Get workspaces config
    const workspacesConfig = await getWorkspacesConfig();

    // Should remove workspace path from workspaces config
    expect(workspacesConfig.paths.includes(workspace1.path)).toBeFalsy();
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
    // Remove a workspace that does not exist, should not throw
    expect(async () => deleteWorkspace('missing')).not.toThrow();
  });
});
