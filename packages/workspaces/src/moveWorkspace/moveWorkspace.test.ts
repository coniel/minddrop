import {
  Fs,
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
import * as WRITE_CONFIG from '../writeWorkspacesConfig';
import { moveWorkspace } from './moveWorkspace';

const WORKSPACE_PATH = workspace1.path;
const DESTINATION_PATH = '/New/Path';
const NEW_WORKSPACE_PATH = `/New/Path/${workspace1.name}`;

let workspaceDirExists: boolean;
let destinationDirExists: boolean;
let hasConflictingDir: boolean;

registerFileSystemAdapter({
  ...MockFsAdapter,
  exists: async (path) => {
    switch (path) {
      case WORKSPACE_PATH:
        return workspaceDirExists;
      case DESTINATION_PATH:
        return destinationDirExists;
      case NEW_WORKSPACE_PATH:
        return hasConflictingDir;
      default:
        throw new Error(`Unexpected path: ${path}`);
    }
  },
});

describe('moveWorkspace', () => {
  beforeEach(() => {
    setup();

    // Add a workspace to the store
    WorkspacesStore.getState().add(workspace1);

    // Reset 'exists' responses
    workspaceDirExists = true;
    destinationDirExists = true;
    hasConflictingDir = false;
  });

  afterEach(cleanup);

  it('throws if the workspace path does not exist', () => {
    // Pretend workspace path does not exist
    workspaceDirExists = false;

    // Attempt to move a workspace from an invalid path,
    // should throw a InvalidPathError.
    expect(() =>
      moveWorkspace(WORKSPACE_PATH, DESTINATION_PATH),
    ).rejects.toThrowError(InvalidPathError);
  });

  it('throws if the destination path does not exist', () => {
    // Pretend destination path does not exist
    destinationDirExists = false;

    // Attempt to move a workspace to an invalid destination,
    // should throw a InvalidPathError.
    expect(() =>
      moveWorkspace(WORKSPACE_PATH, DESTINATION_PATH),
    ).rejects.toThrowError(InvalidPathError);
  });

  it('throws if the there is a conflicting dir', () => {
    // Pretend destination path already contains a dir
    // of the same name.
    hasConflictingDir = true;

    // Attempt to move a workspace with a conflicting dir,
    // should throw a PathConflictError.
    expect(() =>
      moveWorkspace(WORKSPACE_PATH, DESTINATION_PATH),
    ).rejects.toThrowError(PathConflictError);
  });

  it('renames the workspace dir', async () => {
    vi.spyOn(Fs, 'renameFile');

    // Move a workspace
    await moveWorkspace(WORKSPACE_PATH, DESTINATION_PATH);

    // Should rename workspace path to new path
    expect(Fs.renameFile).toHaveBeenCalledWith(
      WORKSPACE_PATH,
      NEW_WORKSPACE_PATH,
    );
  });

  it('updates the workspace path in the store', async () => {
    // Move a workspace
    await moveWorkspace(WORKSPACE_PATH, DESTINATION_PATH);

    // Should update the workspace path in the store
    expect(getWorkspace(NEW_WORKSPACE_PATH)).toBeDefined();
    // Should remove old workspace path from store
    expect(getWorkspace(WORKSPACE_PATH)).toBeNull();
  });

  it('updates the workspaces config file', async () => {
    vi.spyOn(WRITE_CONFIG, 'writeWorkspacesConfig').mockResolvedValue();

    // Move a workspace
    await moveWorkspace(WORKSPACE_PATH, DESTINATION_PATH);

    // Should write updated workspace path to config
    expect(WRITE_CONFIG.writeWorkspacesConfig).toHaveBeenCalled();
  });

  it('dispatches a `workspaces:workspace:move` event', () =>
    new Promise<void>((done) => {
      // Listen to 'workspaces:workspace:move' events
      Events.addListener('workspaces:workspace:move', 'test', (payload) => {
        // Payload data should contain old and new paths
        expect(payload.data).toEqual({
          oldPath: WORKSPACE_PATH,
          newPath: NEW_WORKSPACE_PATH,
        });
        done();
      });

      // Move a workspace
      moveWorkspace(WORKSPACE_PATH, DESTINATION_PATH);
    }));
});
