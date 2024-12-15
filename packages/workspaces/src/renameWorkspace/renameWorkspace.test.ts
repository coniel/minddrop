import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import {
  InvalidPathError,
  PathConflictError,
  initializeMockFileSystem,
} from '@minddrop/file-system';
import { InvalidParameterError } from '@minddrop/utils';
import { WorkspacesStore } from '../WorkspacesStore';
import { getWorkspace } from '../getWorkspace';
import { getWorkspacesConfig } from '../getWorkspacesConfig';
import {
  cleanup,
  setup,
  workspace1,
  workspcesConfigFileDescriptor,
} from '../test-utils';
import { renameWorkspace } from './renameWorkspace';

const WORKSPACE_PATH = workspace1.path;
const NEW_WORKSPACE_NAME = 'New name';
const NEW_WORKSPACE_PATH = `${workspace1.path
  .split('/')
  .slice(0, -1)
  .join('/')}/${NEW_WORKSPACE_NAME}`;
const UPDATED_WORKSPACE = {
  ...workspace1,
  name: NEW_WORKSPACE_NAME,
  path: NEW_WORKSPACE_PATH,
};

const MockFs = initializeMockFileSystem([
  // Workspaces config file
  workspcesConfigFileDescriptor,
  // Workspace
  WORKSPACE_PATH,
]);

describe('renameWorkspace', () => {
  beforeEach(() => {
    setup();

    // Reset mock file system
    MockFs.reset();

    // Add a workspace to the store
    WorkspacesStore.getState().add(workspace1);
  });

  afterEach(cleanup);

  it('throws if the workspace does not exist', () => {
    // Attempt to rename a workspace that is not in the store,
    // should throw a InvalidParameterError.
    expect(() =>
      renameWorkspace('missing-workspace', NEW_WORKSPACE_NAME),
    ).rejects.toThrowError(InvalidParameterError);
  });

  it('throws if the workspace dir does not exist', () => {
    // Pretend that workspace dir does not exist
    MockFs.removeDir(WORKSPACE_PATH);

    // Attempt to rename a workspace for which the dir is missing,
    // should throw a InvalidPathError.
    expect(() =>
      renameWorkspace(WORKSPACE_PATH, NEW_WORKSPACE_NAME),
    ).rejects.toThrowError(InvalidPathError);
  });

  it('throws if a conflicting dir already exists', () => {
    // Pretend that a dir with new workspace name already exists
    MockFs.addFiles([NEW_WORKSPACE_PATH]);

    // Attempt to rename a workspace for which the new name would
    // cause a conflict, should throw a PathConflictError.
    expect(() =>
      renameWorkspace(WORKSPACE_PATH, NEW_WORKSPACE_NAME),
    ).rejects.toThrowError(PathConflictError);
  });

  it('renames the workspace dir', async () => {
    // Rename a workspace
    await renameWorkspace(WORKSPACE_PATH, NEW_WORKSPACE_NAME);

    // Old workspace dir should no longer exist
    expect(MockFs.exists(WORKSPACE_PATH)).toBeFalsy();
    // New workspace dir should exist
    expect(MockFs.exists(NEW_WORKSPACE_PATH)).toBeTruthy();
  });

  it('updates the workspace in the store', async () => {
    // Rename a workspace
    await renameWorkspace(WORKSPACE_PATH, NEW_WORKSPACE_NAME);

    // Store should contain renamed workspace
    expect(getWorkspace(NEW_WORKSPACE_PATH)).toEqual(UPDATED_WORKSPACE);
    // Store should no longer contain original workspace
    expect(getWorkspace(WORKSPACE_PATH)).toBeNull();
  });

  it('updates the workspaces config file', async () => {
    // Rename a workspace
    await renameWorkspace(WORKSPACE_PATH, NEW_WORKSPACE_NAME);

    // Get the workspaces config
    const config = await getWorkspacesConfig();

    // Config should contain new workspace path
    expect(config.paths.includes(NEW_WORKSPACE_PATH)).toBeTruthy();
    // Config should no longer contain old workspace path
    expect(config.paths.includes(WORKSPACE_PATH)).toBeFalsy();
  });

  it('dispatches a `workspaces:workspace:rename` event', () =>
    new Promise<void>((done) => {
      // Listen to 'workspaces:workspace:rename' events
      Events.addListener('workspaces:workspace:rename', 'test', (payload) => {
        // Payload data should contain old and new paths
        expect(payload.data).toEqual({
          oldPath: WORKSPACE_PATH,
          newPath: NEW_WORKSPACE_PATH,
        });
        done();
      });

      // Rename a workspace
      renameWorkspace(WORKSPACE_PATH, NEW_WORKSPACE_NAME);
    }));

  it('returns the updated workspace', async () => {
    // Should return updated workspace
    expect(await renameWorkspace(WORKSPACE_PATH, NEW_WORKSPACE_NAME)).toEqual(
      UPDATED_WORKSPACE,
    );
  });
});
