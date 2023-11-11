import { registerFileSystemAdapter } from '@minddrop/core';
import { MockFsAdapter } from '@minddrop/test-utils';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import {
  setup,
  cleanup,
  workspace1,
  missingWorkspace,
  workspace1Config,
} from '../test-utils';
import * as GET_WORKSPACE_CONFIG from '../getWorkspaceConfig';
import { getWorkspaceFromPath } from './getWorkspaceFromPath';

const exists = vi.fn();

describe('getWorkspaceFromPath', () => {
  beforeEach(() => {
    setup();

    // Pretend that workspace 2 does not exist
    exists.mockImplementation(
      (path) =>
        new Promise((resolve) => {
          resolve(path !== missingWorkspace.path);
        }),
    );

    // Return workspace1Config for workspace1
    vi.spyOn(GET_WORKSPACE_CONFIG, 'getWorkspaceConfig').mockResolvedValue(
      workspace1Config,
    );

    registerFileSystemAdapter({
      ...MockFsAdapter,
      exists,
    });
  });

  afterEach(cleanup);

  it('returns a workspace', async () => {
    // Get a workspace
    const workspace = await getWorkspaceFromPath(workspace1.path);

    // Should return workspace
    expect(workspace).toEqual(workspace1);
  });

  it('sets `exists` to false if workspace directory does not exist', async () => {
    // Get a workspace from a non-existent path
    const workspace = await getWorkspaceFromPath(missingWorkspace.path);

    // Should return workspace with exists = false
    expect(workspace).toEqual(missingWorkspace);
  });
});
