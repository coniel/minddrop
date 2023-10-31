import { registerFileSystemAdapter } from '@minddrop/core';
import { MockFsAdapter } from '@minddrop/test-utils';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { setup, cleanup } from '../test-utils';
import { hasWorkspacesConfig } from './hasWorkspacesConfig';

// Mock Fs.exists
const exists = vi.fn();

registerFileSystemAdapter({
  ...MockFsAdapter,
  exists,
});

describe('hasWorkspacesConfig', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns true if the workspaces config file exists', async () => {
    // Pretend workspaces config file exists
    exists.mockResolvedValueOnce(true);

    // Should return true
    expect(await hasWorkspacesConfig()).toBe(true);
  });

  it('returns false if the workspaces config file does not exist', async () => {
    // Pretend workspaces config file does not exist
    exists.mockResolvedValueOnce(false);

    // Should return false
    expect(await hasWorkspacesConfig()).toBe(false);
  });
});
