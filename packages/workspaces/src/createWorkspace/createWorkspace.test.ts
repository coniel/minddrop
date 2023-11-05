import {
  InvalidPathError,
  PathConflictError,
  registerFileSystemAdapter,
} from '@minddrop/core';
import { Events } from '@minddrop/events';
import { MockFsAdapter } from '@minddrop/test-utils';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import * as ADD_WORKSPACE from '../addWorkspace';
import { setup, cleanup } from '../test-utils';
import { Workspace } from '../types';
import { createWorkspace } from './createWorkspace';

const WORKSPACE_LOCATION = '/Users/Documents/';
const WORKSPACE_NAME = 'My Workspace';
const INVALID_WORKSPACE_LOCATION = '/foo';
const EXISTING_WORKSPACE_NAME = 'Taken';
const WORKSPACE_PATH = `${WORKSPACE_LOCATION}${WORKSPACE_NAME}`;
const EXISTING_WORKSPACE_PATH = `${WORKSPACE_LOCATION}${EXISTING_WORKSPACE_NAME}`;
const WORKSPACE: Workspace = {
  path: WORKSPACE_PATH,
  name: WORKSPACE_NAME,
  exists: true,
};

const exists = async (path: string) =>
  path === WORKSPACE_LOCATION ||
  path === WORKSPACE_LOCATION.slice(0, -1) ||
  path === EXISTING_WORKSPACE_PATH;

const createDir = vi.fn();

registerFileSystemAdapter({
  ...MockFsAdapter,
  exists,
  createDir,
});

describe('createWorkspace', () => {
  vi.spyOn(ADD_WORKSPACE, 'addWorkspace').mockResolvedValue(WORKSPACE);

  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the location does not exist', async () => {
    // Attempt to create a workspace at an invalid location,
    // should throw a 'InvalidPathError'
    expect(async () =>
      createWorkspace(INVALID_WORKSPACE_LOCATION, WORKSPACE_NAME),
    ).rejects.toThrowError(InvalidPathError);
  });

  it('throws if workspace dir already exists', async () => {
    // Attempt to create a workspace which already exists,
    // should throw a 'PathConflictError'
    expect(async () =>
      createWorkspace(WORKSPACE_LOCATION, EXISTING_WORKSPACE_NAME),
    ).rejects.toThrowError(PathConflictError);
  });

  it('creates the workspace dir', async () => {
    // Create a workspace
    await createWorkspace(WORKSPACE_LOCATION, WORKSPACE_NAME);

    // Should create workspace dir
    expect(createDir).toHaveBeenCalledWith(WORKSPACE_PATH);
  });

  it('adds the workspace to the store', async () => {
    // Create a workspace
    await createWorkspace(WORKSPACE_LOCATION, WORKSPACE_NAME);

    // Workspace should be in the store
    expect(ADD_WORKSPACE.addWorkspace).toHaveBeenCalledWith(WORKSPACE_PATH);
  });

  it('dispatches a `workspaces:workspace:add` event', async () =>
    new Promise<void>((done) => {
      // Listen to 'workspaces:workspace:create' events
      Events.addListener('workspaces:workspace:create', 'test', (payload) => {
        // Payload data should be the workspace
        expect(payload.data).toEqual(WORKSPACE);
        done();
      });

      // Add a workspace
      createWorkspace(WORKSPACE_LOCATION, WORKSPACE_NAME);
    }));

  it('returns the workspace', async () => {
    // Create a workspace
    const workspace = await createWorkspace(WORKSPACE_LOCATION, WORKSPACE_NAME);

    // Should return a workspace
    expect(workspace).toEqual(WORKSPACE);
  });

  it('supports location without trailing /', async () => {
    // Create a workspace with a location missing trailing '/'
    const workspace = await createWorkspace(
      WORKSPACE_LOCATION.slice(0, -1),
      WORKSPACE_NAME,
    );

    expect(workspace.path).toEqual(WORKSPACE_PATH);
  });
});
