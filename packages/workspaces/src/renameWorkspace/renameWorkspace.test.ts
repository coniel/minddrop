import {
  Fs,
  InvalidParameterError,
  InvalidPathError,
  PathConflictError,
  registerFileSystemAdapter,
} from '@minddrop/core';
import { Events } from '@minddrop/events';
import { MockFsAdapter } from '@minddrop/test-utils';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { getWorkspace } from '../getWorkspace';
import { setup, cleanup, workspace1 } from '../test-utils';
import { WorkspacesStore } from '../WorkspacesStore';
import { renameWorkspace } from './renameWorkspace';

const WORKSPACE_PATH = workspace1.path;
const NEW_WORKSPACE_NAME = 'New name';
const NEW_WORKSPACE_PATH = `${workspace1.path
  .split('/')
  .slice(0, -1)
  .join('/')}/${NEW_WORKSPACE_NAME}`;

let workspaceDirExists: boolean;
let newWorkspaceDirConflict: boolean;

registerFileSystemAdapter({
  ...MockFsAdapter,
  exists: async (path: string) => {
    switch (path) {
      case WORKSPACE_PATH:
        return workspaceDirExists;
      case NEW_WORKSPACE_PATH:
        return newWorkspaceDirConflict;
      default:
        throw new Error(`unexpected path: ${path}`);
    }
  },
});

describe('renameWorkspace', () => {
  beforeEach(() => {
    setup();

    // Reset exists reponsponses to defaults
    workspaceDirExists = true;
    newWorkspaceDirConflict = false;

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
    workspaceDirExists = false;

    // Attempt to rename a workspace for which the dir is missing,
    // should throw a InvalidPathError.
    expect(() =>
      renameWorkspace(WORKSPACE_PATH, NEW_WORKSPACE_NAME),
    ).rejects.toThrowError(InvalidPathError);
  });

  it('throws if the workspace dir does not exist', () => {
    // Pretend that a dir with new workspace name already exists
    newWorkspaceDirConflict = true;

    // Attempt to rename a workspace for which the new name would
    // cause a conflict, should throw a PathConflictError.
    expect(() =>
      renameWorkspace(WORKSPACE_PATH, NEW_WORKSPACE_NAME),
    ).rejects.toThrowError(PathConflictError);
  });

  it('renames the workspace dir', async () => {
    vi.spyOn(Fs, 'renameFile');

    // Rename a workspace
    await renameWorkspace(WORKSPACE_PATH, NEW_WORKSPACE_NAME);

    // Should rename workspace dir
    expect(Fs.renameFile).toHaveBeenCalledWith(
      WORKSPACE_PATH,
      NEW_WORKSPACE_PATH,
    );
  });

  it('updates the workspace in the store', async () => {
    // Rename a workspace
    await renameWorkspace(WORKSPACE_PATH, NEW_WORKSPACE_NAME);

    // Store should contain renamed workspace
    expect(getWorkspace(NEW_WORKSPACE_PATH)?.path).toBe(NEW_WORKSPACE_PATH);
    // Store should no longer contain original workspace
    expect(getWorkspace(WORKSPACE_PATH)).toBeNull();
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
    expect(await renameWorkspace(WORKSPACE_PATH, NEW_WORKSPACE_NAME)).toEqual({
      ...workspace1,
      path: NEW_WORKSPACE_PATH,
    });
  });
});
