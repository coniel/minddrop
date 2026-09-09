import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { ActiveWorkspaceStore } from '../ActiveWorkspaceStore';
import { WorkspacesStore } from '../WorkspacesStore';
import { WorkspaceDeletedEvent } from '../events';
import {
  MockFs,
  cleanup,
  setup,
  workspace_1,
  workspace_2,
  workspace_3,
} from '../test-utils';
import { WorkspacesConfig } from '../types';
import { resolveWorkspacesConfigFilePath } from '../utils';
import { removeWorkspace } from './removeWorkspace';

describe('removeWorkspace', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('removes the workspace from the store', async () => {
    await removeWorkspace(workspace_1.id);

    expect(WorkspacesStore).not.toHaveItem(workspace_1.id);
  });

  it('writes the workspaces config', async () => {
    await removeWorkspace(workspace_1.id);

    const config = MockFs.readJsonFile<WorkspacesConfig>(
      resolveWorkspacesConfigFilePath(),
    );

    expect(config.paths.includes(workspace_1.path)).toBe(false);
  });

  it('makes the first remaining workspace active when the active one is removed', async () => {
    await removeWorkspace(workspace_1.id);

    expect(ActiveWorkspaceStore).toHaveStoredValue('id', workspace_2.id);
  });

  it('clears the active workspace when the last one is removed', async () => {
    await removeWorkspace(workspace_2.id);
    await removeWorkspace(workspace_3.id);
    await removeWorkspace(workspace_1.id);

    expect(ActiveWorkspaceStore.get('id')).toBeNull();
  });

  it('keeps the active workspace when another one is removed', async () => {
    await removeWorkspace(workspace_2.id);

    expect(ActiveWorkspaceStore).toHaveStoredValue('id', workspace_1.id);
  });

  it('dispatches a workspaces deleted event', async () =>
    new Promise<void>((done) => {
      Events.addListener(WorkspaceDeletedEvent, 'test', (payload) => {
        expect(payload).toEqual(workspace_1);
        done();
      });

      removeWorkspace(workspace_1.id);
    }));
});
