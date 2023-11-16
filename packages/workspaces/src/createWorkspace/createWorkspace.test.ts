import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import {
  InvalidPathError,
  PathConflictError,
  initializeMockFileSystem,
} from '@minddrop/file-system';
import { Events } from '@minddrop/events';
import {
  setup,
  cleanup,
  workspcesConfigFileDescriptor,
  newWorkspace,
} from '../test-utils';
import { Workspace } from '../types';
import { createWorkspace } from './createWorkspace';
import { getWorkspace } from '../getWorkspace';

const WORKSPACE_LOCATION = 'Users/foo/Documents';
const WORKSPACE_NAME = 'My Workspace';
const INVALID_WORKSPACE_LOCATION = 'foo';
const EXISTING_WORKSPACE_NAME = 'Taken';
const WORKSPACE_PATH = `${WORKSPACE_LOCATION}/${WORKSPACE_NAME}`;
const EXISTING_WORKSPACE_PATH = `${WORKSPACE_LOCATION}/${EXISTING_WORKSPACE_NAME}`;
const WORKSPACE: Workspace = {
  ...newWorkspace,
  path: WORKSPACE_PATH,
  name: WORKSPACE_NAME,
  exists: true,
};

const MockFs = initializeMockFileSystem([
  // Workspaces config file
  workspcesConfigFileDescriptor,
  // Existing workspace
  EXISTING_WORKSPACE_PATH,
]);

describe('createWorkspace', () => {
  beforeEach(() => {
    setup();

    // Reset mock file system
    MockFs.reset();
  });

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
    expect(MockFs.exists(WORKSPACE_LOCATION)).toBe(true);
  });

  it('adds the workspace to the store', async () => {
    // Create a workspace
    await createWorkspace(WORKSPACE_LOCATION, WORKSPACE_NAME);

    // Workspace should be in the store
    expect(getWorkspace(WORKSPACE_PATH)).not.toBeNull();
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
});
