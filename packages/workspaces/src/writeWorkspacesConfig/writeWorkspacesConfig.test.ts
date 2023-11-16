import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { getWorkspacesConfig } from '../getWorkspacesConfig';
import {
  setup,
  cleanup,
  workspace1,
  missingWorkspace,
  workspcesConfigFileDescriptor,
  workspacesConfig,
} from '../test-utils';
import { WorkspacesStore } from '../WorkspacesStore';
import { writeWorkspacesConfig } from './writeWorkspacesConfig';

const MockFs = initializeMockFileSystem([
  // Workspaces config file
  {
    ...workspcesConfigFileDescriptor,
    textContent: JSON.stringify({ ...workspacesConfig, paths: [] }),
  },
]);

describe('writeWorkspacesConfig', () => {
  beforeEach(() => {
    setup();

    // Load workspaces into the store
    WorkspacesStore.getState().load([workspace1, missingWorkspace]);

    // Reset mock file system
    MockFs.reset();
  });

  afterEach(cleanup);

  it('writes workspace paths to the config file', async () => {
    // Write current workspaces state to config file
    await writeWorkspacesConfig();

    // Get workspaces config
    const config = await getWorkspacesConfig();

    // Should contain workspace paths
    expect(config.paths).toEqual([workspace1.path, missingWorkspace.path]);
  });
});
