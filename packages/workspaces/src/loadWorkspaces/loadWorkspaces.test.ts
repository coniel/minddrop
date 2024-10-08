import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { Events } from '@minddrop/events';
import {
  setup,
  cleanup,
  workspace1,
  workspace1ConfigPath,
  workspace1Config,
  workspcesConfigFileDescriptor,
  workspaces,
  workspace2Config,
  workspace2ConfigPath,
} from '../test-utils';
import { WorkspacesStore } from '../WorkspacesStore';
import { loadWorkspaces } from './loadWorkspaces';
import { WorkspacesConfigDir, WorkspacesConfigFileName } from '../constants';

const MockFs = initializeMockFileSystem([
  // Workspaces config file
  workspcesConfigFileDescriptor,
  // Workspace config files
  {
    path: workspace1ConfigPath,
    textContent: JSON.stringify(workspace1Config),
  },
  {
    path: workspace2ConfigPath,
    textContent: JSON.stringify(workspace2Config),
  },
]);

describe('loadWorkspaces', () => {
  beforeEach(() => {
    setup();

    // Reset mock file system
    MockFs.reset();
  });

  afterEach(cleanup);

  it('throws if the workspaces config could not be read', () => {
    // Pretend workspaces file does not exist
    MockFs.removeFile(WorkspacesConfigFileName, {
      baseDir: WorkspacesConfigDir,
    });

    // Should throw
    expect(() => loadWorkspaces()).rejects.toThrow();
  });

  it('loads workspaces into the store', async () => {
    // Load the workspaces
    await loadWorkspaces();

    // Store should contain the workspaces
    expect(WorkspacesStore.getState().workspaces).toEqual(workspaces);
  });

  it('does not load workspaces already present in the store', async () => {
    // Add a workspace to the store
    WorkspacesStore.getState().add(workspace1);

    // Load the workspaces
    await loadWorkspaces();

    // Store should contain the workspaces
    expect(WorkspacesStore.getState().workspaces).toEqual(workspaces);
  });

  it('dispatches a `workspaces:load` event', async () =>
    new Promise<void>((done) => {
      // Listen to 'workspaces:load' events
      Events.addListener('workspaces:load', 'test', (payload) => {
        // Payload data should be the workspaces
        expect(payload.data).toEqual(workspaces);
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
