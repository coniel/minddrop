import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import {
  InvalidPathError,
  PathConflictError,
  initializeMockFileSystem,
} from '@minddrop/file-system';
import { WorkspacesStore } from '../WorkspacesStore';
import { getWorkspace } from '../getWorkspace';
import { getWorkspacesConfig } from '../getWorkspacesConfig';
import {
  cleanup,
  setup,
  workspace1,
  workspcesConfigFileDescriptor,
} from '../test-utils';
import { moveWorkspace } from './moveWorkspace';

const WORKSPACE_PATH = workspace1.path;
const DESTINATION_PATH = 'New/Path';
const NEW_WORKSPACE_PATH = `New/Path/${workspace1.name}`;

const MockFs = initializeMockFileSystem([
  // Workspaces config file
  workspcesConfigFileDescriptor,
  // Workspace
  WORKSPACE_PATH,
  // Destination dir
  DESTINATION_PATH,
]);

describe('moveWorkspace', () => {
  beforeEach(() => {
    setup();

    // Add a workspace to the store
    WorkspacesStore.getState().add(workspace1);

    // Reset mock file system
    MockFs.reset();
  });

  afterEach(cleanup);

  it('throws if the workspace path does not exist', () => {
    // Pretend workspace path does not exist
    MockFs.removeFile(WORKSPACE_PATH);

    // Attempt to move a workspace from an invalid path,
    // should throw a InvalidPathError.
    expect(() =>
      moveWorkspace(WORKSPACE_PATH, DESTINATION_PATH),
    ).rejects.toThrowError(InvalidPathError);
  });

  it('throws if the destination path does not exist', () => {
    // Pretend destination path does not exist
    MockFs.removeDir(DESTINATION_PATH);

    // Attempt to move a workspace to an invalid destination,
    // should throw a InvalidPathError.
    expect(() =>
      moveWorkspace(WORKSPACE_PATH, DESTINATION_PATH),
    ).rejects.toThrowError(InvalidPathError);
  });

  it('throws if the there is a conflicting dir', () => {
    // Pretend destination path already contains a dir
    // of the same name.
    MockFs.addFiles([NEW_WORKSPACE_PATH]);

    // Attempt to move a workspace with a conflicting dir,
    // should throw a PathConflictError.
    expect(() =>
      moveWorkspace(WORKSPACE_PATH, DESTINATION_PATH),
    ).rejects.toThrowError(PathConflictError);
  });

  it('moves the workspace dir', async () => {
    // Move a workspace
    await moveWorkspace(WORKSPACE_PATH, DESTINATION_PATH);

    // Original dir should no longer exist
    expect(MockFs.exists(WORKSPACE_PATH)).toBeFalsy();
    // New dir should exist
    expect(MockFs.exists(NEW_WORKSPACE_PATH)).toBeTruthy();
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
    // Move a workspace
    await moveWorkspace(WORKSPACE_PATH, DESTINATION_PATH);

    // Get workspaces config
    const config = await getWorkspacesConfig();

    // Should write updated workspace path to config
    expect(config.paths.includes(NEW_WORKSPACE_PATH)).toBeTruthy();
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
