import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { WorkspacesStore } from '../WorkspacesStore';
import { getWorkspacesConfig } from '../getWorkspacesConfig';
import {
  cleanup,
  missingWorkspace,
  setup,
  workspace1,
  workspacesConfig,
  workspcesConfigFileDescriptor,
} from '../test-utils';
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
