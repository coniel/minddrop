import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { getActiveWorkspaceScope } from '@minddrop/stores';
import { ActiveWorkspaceStore } from '../ActiveWorkspaceStore';
import { LoadedWorkspacesStore } from '../LoadedWorkspacesStore';
import { WorkspaceLoadersRegistry } from '../WorkspaceLoadersRegistry';
import { WorkspaceNotFoundError } from '../errors';
import { ActiveWorkspaceChangedEvent } from '../events';
import {
  cleanup,
  setup,
  workspace_1,
  workspace_2,
  workspace_3,
} from '../test-utils';
import { setActiveWorkspace } from './setActiveWorkspace';

// The workspaces made active by the dispatched events
let activated: string[] = [];

describe('setActiveWorkspace', () => {
  beforeEach(() => {
    setup();
    activated = [];

    // Collect the workspaces of dispatched active changed events
    Events.addListener(ActiveWorkspaceChangedEvent, 'test', (workspace) => {
      activated.push(workspace.id);
    });
  });

  afterEach(cleanup);

  it('throws if the workspace does not exist', async () => {
    await expect(() => setActiveWorkspace('missing')).rejects.toThrow(
      WorkspaceNotFoundError,
    );
  });

  it('sets the workspace as active', async () => {
    await setActiveWorkspace(workspace_2.id);

    expect(ActiveWorkspaceStore).toHaveStoredValue('id', workspace_2.id);
  });

  it('points workspace scoped stores at the workspace', async () => {
    await setActiveWorkspace(workspace_2.id);

    expect(getActiveWorkspaceScope()).toBe(workspace_2.id);
  });

  it('dispatches an active workspace changed event', async () => {
    await setActiveWorkspace(workspace_2.id);

    expect(activated).toEqual([workspace_2.id]);
  });

  it('does nothing if the workspace is already active', async () => {
    await setActiveWorkspace(workspace_1.id);

    expect(activated).toEqual([]);
  });

  it('loads the workspace before switching to it', async () => {
    // The active workspace as seen by the loader
    let activeWhileLoading: string | null = null;

    WorkspaceLoadersRegistry.register({
      id: 'test',
      load: async () => {
        activeWhileLoading = ActiveWorkspaceStore.get('id');
      },
    });

    await setActiveWorkspace(workspace_2.id);

    expect(activeWhileLoading).toBe(workspace_1.id);
    expect(LoadedWorkspacesStore.get('ids')).toEqual([workspace_2.id]);
  });

  it('lets a switch requested while loading win over the earlier one', async () => {
    WorkspaceLoadersRegistry.register({
      id: 'test',
      load: () => Promise.resolve(),
    });

    await Promise.all([
      setActiveWorkspace(workspace_2.id),
      setActiveWorkspace(workspace_3.id),
    ]);

    expect(ActiveWorkspaceStore).toHaveStoredValue('id', workspace_3.id);
    expect(activated).toEqual([workspace_3.id]);
  });
});
