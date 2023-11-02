import { BaseDirectory, registerFileSystemAdapter } from '@minddrop/core';
import { MockFsAdapter } from '@minddrop/test-utils';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { WorkspacesConfigFile } from '../constants';
import { setup, cleanup, workspace1, missingWorkspace } from '../test-utils';
import { WorkspacesStore } from '../WorkspacesStore';
import { writeWorkspacesConfig } from './writeWorkspacesConfig';

const writeTextFile = vi.fn();

describe('writeWorkspacesConfig', () => {
  beforeEach(() => {
    setup();

    // Load workspaces into the store
    WorkspacesStore.getState().load([workspace1, missingWorkspace]);

    registerFileSystemAdapter({
      ...MockFsAdapter,
      writeTextFile,
    });
  });

  afterEach(cleanup);

  it('writes workspace paths to the config file', async () => {
    await writeWorkspacesConfig();

    // It should write paths to the configs file
    expect(writeTextFile).toHaveBeenCalledWith(
      WorkspacesConfigFile,
      JSON.stringify({ paths: [workspace1.path, missingWorkspace.path] }),
      { dir: BaseDirectory.AppConfig },
    );
  });
});
