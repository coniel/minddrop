import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import {
  FileNotFoundError,
  initializeMockFileSystem,
} from '@minddrop/file-system';
import { WorkspacesStore } from '../WorkspacesStore';
import { getWorkspacesConfig } from '../getWorkspacesConfig';
import {
  cleanup,
  newWorkspace,
  setup,
  workspcesConfigFileDescriptor,
} from '../test-utils';
import { addWorkspace } from './addWorkspace';

const MockFs = initializeMockFileSystem([
  // Workspaces config file
  workspcesConfigFileDescriptor,
  // Workspace to add
  newWorkspace.path,
]);

describe('addWorkspace', () => {
  beforeEach(() => {
    setup();

    // Reset mock file system
    MockFs.reset();
  });

  afterEach(cleanup);

  it('throws if the workspace does not exist', () => {
    // Pretend workspace directory does not exist
    MockFs.clear();

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
    // Add a workspace
    await addWorkspace(newWorkspace.path);

    // Get the workspaces config
    const config = await getWorkspacesConfig();

    // It should persist the new workspace
    expect(config.paths.includes(newWorkspace.path)).toBe(true);
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
