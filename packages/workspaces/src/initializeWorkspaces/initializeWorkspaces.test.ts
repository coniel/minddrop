import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { Paths } from '@minddrop/utils';
import { ActiveWorkspaceStore } from '../ActiveWorkspaceStore';
import { WorkspacesStore } from '../WorkspacesStore';
import { WorkspacesLoadedEvent } from '../events';
import {
  MockFs,
  cleanup,
  setup,
  workspace_1,
  workspace_2,
  workspaces,
  workspacesConfig,
} from '../test-utils';
import { WorkspacesConfig } from '../types';
import { resolveWorkspacesConfigFilePath } from '../utils';
import { initializeWorkspaces } from './initializeWorkspaces';

describe('initializeWorkspaces', () => {
  beforeEach(() => setup({ loadWorkspaces: false }));

  afterEach(cleanup);

  it('creates the workspaces config file if it does not exist', async () => {
    // Remove the workspaces config file
    MockFs.removeFile(resolveWorkspacesConfigFilePath());

    await initializeWorkspaces();

    expect(MockFs.exists(resolveWorkspacesConfigFilePath())).toBe(true);
  });

  it('loads workspaces into the store', async () => {
    await initializeWorkspaces();

    expect(WorkspacesStore.getAllArray()).toEqual(workspaces);
  });

  it('sets the workspace from the config active path as active', async () => {
    // Make workspace_2 the config's active workspace
    MockFs.writeJsonFile(resolveWorkspacesConfigFilePath(), {
      ...workspacesConfig,
      activePath: workspace_2.path,
    });

    await initializeWorkspaces();

    expect(ActiveWorkspaceStore.get('id')).toBe(workspace_2.id);
  });

  it('sets the workspace paths from the active workspace', async () => {
    // Make workspace_2 the config's active workspace
    MockFs.writeJsonFile(resolveWorkspacesConfigFilePath(), {
      ...workspacesConfig,
      activePath: workspace_2.path,
    });

    await initializeWorkspaces();

    expect(Paths.workspace).toBe(workspace_2.path);
    expect(Paths.workspaceConfigs).toBe(
      `${workspace_2.path}/${Paths.hiddenDirName}`,
    );
  });

  it('falls back to the first workspace when the active path is unknown', async () => {
    // Remove the active path from the config
    MockFs.writeJsonFile(resolveWorkspacesConfigFilePath(), {
      paths: workspacesConfig.paths,
    });

    await initializeWorkspaces();

    expect(ActiveWorkspaceStore.get('id')).toBe(workspace_1.id);
  });

  it('persists the fallback active workspace', async () => {
    // Remove the active path from the config
    MockFs.writeJsonFile(resolveWorkspacesConfigFilePath(), {
      paths: workspacesConfig.paths,
    });

    await initializeWorkspaces();

    const config = MockFs.readJsonFile<WorkspacesConfig>(
      resolveWorkspacesConfigFilePath(),
    );

    expect(config.activePath).toBe(workspace_1.path);
  });

  it('dispatches a workspaces loaded event', async () =>
    new Promise<void>((done) => {
      Events.addListener(WorkspacesLoadedEvent, 'test', (payload) => {
        expect(payload).toEqual(workspaces);
        done();
      });

      initializeWorkspaces();
    }));
});
