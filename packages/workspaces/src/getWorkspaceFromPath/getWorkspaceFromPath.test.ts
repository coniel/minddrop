import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { initializeMockFileSystem } from '@minddrop/file-system';
import {
  setup,
  cleanup,
  workspace1,
  missingWorkspace,
  workspace1Config,
  workspace1ConfigPath,
} from '../test-utils';
import { getWorkspaceFromPath } from './getWorkspaceFromPath';

initializeMockFileSystem([
  // Workspace 1 config file
  { path: workspace1ConfigPath, textContent: JSON.stringify(workspace1Config) },
]);

describe('getWorkspaceFromPath', () => {
  beforeEach(setup);

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
