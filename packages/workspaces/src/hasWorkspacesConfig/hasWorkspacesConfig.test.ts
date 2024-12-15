import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { cleanup, setup, workspcesConfigFileDescriptor } from '../test-utils';
import { hasWorkspacesConfig } from './hasWorkspacesConfig';

const MockFs = initializeMockFileSystem([
  // Workspaces config file
  workspcesConfigFileDescriptor,
]);

describe('hasWorkspacesConfig', () => {
  beforeEach(() => {
    setup();

    // Resert mock file system
    MockFs.reset();
  });

  afterEach(cleanup);

  it('returns true if the workspaces config file exists', async () => {
    // Should return true
    expect(await hasWorkspacesConfig()).toBe(true);
  });

  it('returns false if the workspaces config file does not exist', async () => {
    // Pretend workspaces config file does not exist
    MockFs.clear();

    // Should return false
    expect(await hasWorkspacesConfig()).toBe(false);
  });
});
