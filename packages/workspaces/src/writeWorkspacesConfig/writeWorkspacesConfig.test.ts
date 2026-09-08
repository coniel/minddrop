import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ActiveWorkspaceStore } from '../ActiveWorkspaceStore';
import { MockFs, cleanup, setup, workspacesConfig } from '../test-utils';
import { WorkspacesConfig } from '../types';
import { resolveWorkspacesConfigFilePath } from '../utils';
import { writeWorkspacesConfig } from './writeWorkspacesConfig';

describe('writeWorkspacesConfig', () => {
  beforeEach(() => setup({ loadWorkspacesConfig: false }));

  afterEach(cleanup);

  it('writes the workspaces config to the file system', async () => {
    await writeWorkspacesConfig();

    expect(MockFs.readJsonFile(resolveWorkspacesConfigFilePath())).toEqual(
      workspacesConfig,
    );
  });

  it('omits the active path when there is no active workspace', async () => {
    // Clear the active workspace
    ActiveWorkspaceStore.set('id', null);

    await writeWorkspacesConfig();

    const config = MockFs.readJsonFile<WorkspacesConfig>(
      resolveWorkspacesConfigFilePath(),
    );

    expect(config.activePath).toBeUndefined();
  });
});
