import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { getActiveWorkspaceScope } from '@minddrop/stores';
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
} from '../test-utils';
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

    expect(WorkspacesStore).toHaveItems(workspaces);
  });

  it('keeps the hydrated workspace active', async () => {
    // Stand in for the store having been hydrated with workspace_2
    ActiveWorkspaceStore.set('id', workspace_2.id);

    await initializeWorkspaces();

    expect(ActiveWorkspaceStore).toHaveStoredValue('id', workspace_2.id);
  });

  it('points workspace scoped stores at the active workspace', async () => {
    // Stand in for the store having been hydrated with workspace_2
    ActiveWorkspaceStore.set('id', workspace_2.id);

    await initializeWorkspaces();

    expect(getActiveWorkspaceScope()).toBe(workspace_2.id);
  });

  it('falls back to the first workspace when none is active', async () => {
    await initializeWorkspaces();

    expect(ActiveWorkspaceStore).toHaveStoredValue('id', workspace_1.id);
  });

  it('falls back to the first workspace when the active one is no longer listed', async () => {
    // Stand in for a workspace that has since been removed
    ActiveWorkspaceStore.set('id', 'workspace_missing');

    await initializeWorkspaces();

    expect(ActiveWorkspaceStore.get('id')).toBe(workspace_1.id);
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
